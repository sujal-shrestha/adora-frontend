// src/pages/Settings.jsx
import { useEffect, useMemo, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { Dialog } from "@headlessui/react";
import {
  FiUser,
  FiLock,
  FiAlertTriangle,
  FiLogOut,
  FiSave,
  FiEye,
  FiEyeOff,
  FiX,
} from "react-icons/fi";

const cx = (...classes) => classes.filter(Boolean).join(" ");

function NeonPill({ children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
      <span className="h-1.5 w-1.5 rounded-full bg-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.7)]" />
      {children}
    </span>
  );
}

function Toast({ type, text }) {
  if (!text) return null;
  const cls =
    type === "success"
      ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-200"
      : type === "error"
      ? "border-rose-400/20 bg-rose-500/10 text-rose-200"
      : "border-white/10 bg-white/5 text-white/80";

  return <div className={cx("mt-4 rounded-2xl border px-4 py-3 text-sm", cls)}>{text}</div>;
}

function GlassModal({ open, title, subtitle, onClose, children }) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_30px_rgba(168,85,247,0.12)] overflow-hidden">
          <div className="flex items-start justify-between gap-4 p-5 border-b border-white/10">
            <div>
              <Dialog.Title className="text-lg font-semibold text-white">{title}</Dialog.Title>
              {subtitle ? <p className="mt-1 text-sm text-white/60">{subtitle}</p> : null}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/5 p-2 text-white/70 hover:bg-white/10 transition"
              aria-label="Close"
              title="Close"
            >
              <FiX />
            </button>
          </div>

          <div className="p-5">{children}</div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

function TabButton({ active, icon: Icon, label, onClick, tone = "neutral" }) {
  const activeCls =
    tone === "danger"
      ? "border-rose-400/20 bg-rose-500/10 text-rose-100"
      : "border-purple-400/30 bg-purple-500/10 text-white";
  const idleCls =
    tone === "danger"
      ? "border-white/10 bg-white/5 text-rose-200/80 hover:bg-white/10"
      : "border-white/10 bg-white/5 text-white/75 hover:bg-white/10";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "w-full px-4 py-3 rounded-2xl border transition inline-flex items-center gap-3",
        active ? activeCls : idleCls
      )}
    >
      <Icon className="text-white" />
      <span className="font-medium">{label}</span>
    </button>
  );
}

export default function Settings() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("account"); // account | security | danger

  const [profile, setProfile] = useState({ name: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [loading, setLoading] = useState(true);

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [toast, setToast] = useState({ type: "", text: "" });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteText, setDeleteText] = useState("");

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const flash = (type, text) => {
    setToast({ type, text });
    window.clearTimeout(flash._t);
    flash._t = window.setTimeout(() => setToast({ type: "", text: "" }), 2500);
  };

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users/me");
      setProfile({
        name: res.data?.name || "",
        email: res.data?.email || "",
      });
    } catch (err) {
      console.error("Error fetching profile:", err);
      flash("error", "Failed to load settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    if (!profile.name.trim()) return flash("error", "Name is required.");
    if (!profile.email.trim()) return flash("error", "Email is required.");

    setSavingProfile(true);
    try {
      await api.put("/users/me", {
        name: profile.name.trim(),
        email: profile.email.trim(),
      });
      flash("success", "Profile updated ✅");
    } catch (err) {
      console.error("Error updating profile:", err);
      flash("error", err?.response?.data?.message || "Error updating profile ❌");
    } finally {
      setSavingProfile(false);
    }
  };

  const passwordIssues = useMemo(() => {
    const issues = [];
    if (!passwordForm.currentPassword) issues.push("Current password required");
    if (!passwordForm.newPassword) issues.push("New password required");
    if (passwordForm.newPassword && passwordForm.newPassword.length < 6)
      issues.push("New password must be at least 6 characters");
    return issues;
  }, [passwordForm]);

  const handlePasswordChange = async () => {
    if (passwordIssues.length) return flash("error", passwordIssues[0]);

    setSavingPassword(true);
    try {
      await api.put("/users/me/password", passwordForm);
      flash("success", "Password updated ✅");
      setPasswordForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      console.error("Error changing password:", err);
      flash("error", err?.response?.data?.message || "Error changing password ❌");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await api.delete("/users/me");
      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      console.error("Error deleting account:", err);
      flash("error", err?.response?.data?.message || "Error deleting account ❌");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const inputBase =
    "mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/35 outline-none focus:border-purple-400/40 focus:ring-2 focus:ring-purple-500/20 transition";

  return (
    <div className="min-h-screen bg-[#05060a] text-white px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <NeonPill>Account</NeonPill>
            <h1 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight text-white">
              Settings
            </h1>
            <p className="mt-2 text-white/65 max-w-2xl">
              Manage your profile, security, and account access.
            </p>
          </div>
        </div>

        <Toast type={toast.type} text={toast.text} />

        <div className="mt-6 grid lg:grid-cols-3 gap-5">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-4">
              <div className="text-xs uppercase tracking-wider text-white/55 px-2 pb-3">
                Sections
              </div>

              <div className="space-y-2">
                <TabButton
                  active={activeTab === "account"}
                  icon={FiUser}
                  label="Account"
                  onClick={() => setActiveTab("account")}
                />
                <TabButton
                  active={activeTab === "security"}
                  icon={FiLock}
                  label="Security"
                  onClick={() => setActiveTab("security")}
                />
                <TabButton
                  active={activeTab === "danger"}
                  icon={FiAlertTriangle}
                  label="Danger Zone"
                  tone="danger"
                  onClick={() => setActiveTab("danger")}
                />
              </div>

              <div className="mt-4 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowLogoutModal(true)}
                  className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 transition inline-flex items-center gap-3"
                >
                  <FiLogOut className="text-white" />
                  <span className="font-medium">Log out</span>
                </button>
              </div>
            </div>

            {/* Mobile tabs (optional quick UX) */}
            <div className="lg:hidden mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("account")}
                className={cx(
                  "flex-1 px-3 py-2 rounded-xl border text-sm transition",
                  activeTab === "account"
                    ? "border-purple-400/30 bg-purple-500/10 text-white"
                    : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                )}
              >
                Account
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("security")}
                className={cx(
                  "flex-1 px-3 py-2 rounded-xl border text-sm transition",
                  activeTab === "security"
                    ? "border-purple-400/30 bg-purple-500/10 text-white"
                    : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                )}
              >
                Security
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("danger")}
                className={cx(
                  "flex-1 px-3 py-2 rounded-xl border text-sm transition",
                  activeTab === "danger"
                    ? "border-rose-400/30 bg-rose-500/10 text-rose-100"
                    : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                )}
              >
                Danger
              </button>
            </div>
          </aside>

          {/* Main */}
          <main className="lg:col-span-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
              {loading ? (
                <div className="text-white/60 text-sm">Loading settings…</div>
              ) : (
                <>
                  {/* Account */}
                  {activeTab === "account" && (
                    <div>
                      <h2 className="text-white font-semibold text-lg">Account details</h2>
                      <p className="mt-1 text-sm text-white/60">
                        Update your basic profile information.
                      </p>

                      <div className="mt-5 grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-white/55 uppercase tracking-wider">
                            Name
                          </label>
                          <input
                            type="text"
                            className={inputBase}
                            value={profile.name}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                            placeholder="Your name"
                          />
                        </div>

                        <div>
                          <label className="text-xs text-white/55 uppercase tracking-wider">
                            Email
                          </label>
                          <input
                            type="email"
                            className={inputBase}
                            value={profile.email}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                            placeholder="you@domain.com"
                          />
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-end">
                        <button
                          type="button"
                          onClick={handleProfileUpdate}
                          disabled={savingProfile}
                          className={cx(
                            "px-4 py-3 rounded-xl font-semibold transition inline-flex items-center gap-2",
                            savingProfile
                              ? "bg-white/10 text-white/40 cursor-not-allowed"
                              : "bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white shadow-[0_0_26px_rgba(168,85,247,0.22)] hover:opacity-95"
                          )}
                        >
                          <FiSave />
                          {savingProfile ? "Saving..." : "Save changes"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Security */}
                  {activeTab === "security" && (
                    <div>
                      <h2 className="text-white font-semibold text-lg">Security</h2>
                      <p className="mt-1 text-sm text-white/60">
                        Change your password regularly to stay secure.
                      </p>

                      <div className="mt-5 grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-white/55 uppercase tracking-wider">
                            Current password
                          </label>
                          <div className="relative mt-2">
                            <input
                              type={showCurrentPw ? "text" : "password"}
                              className={cx(inputBase, "mt-0 pr-12")}
                              value={passwordForm.currentPassword}
                              onChange={(e) =>
                                setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                              }
                              placeholder="••••••••"
                            />
                            <button
                              type="button"
                              onClick={() => setShowCurrentPw((v) => !v)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg border border-white/10 bg-white/5 p-2 text-white/70 hover:bg-white/10 transition"
                              title={showCurrentPw ? "Hide" : "Show"}
                            >
                              {showCurrentPw ? <FiEyeOff /> : <FiEye />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="text-xs text-white/55 uppercase tracking-wider">
                            New password
                          </label>
                          <div className="relative mt-2">
                            <input
                              type={showNewPw ? "text" : "password"}
                              className={cx(inputBase, "mt-0 pr-12")}
                              value={passwordForm.newPassword}
                              onChange={(e) =>
                                setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                              }
                              placeholder="At least 6 characters"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPw((v) => !v)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg border border-white/10 bg-white/5 p-2 text-white/70 hover:bg-white/10 transition"
                              title={showNewPw ? "Hide" : "Show"}
                            >
                              {showNewPw ? <FiEyeOff /> : <FiEye />}
                            </button>
                          </div>
                        </div>
                      </div>

                      {passwordIssues.length > 0 && (
                        <div className="mt-3 text-xs text-white/55">
                          Tip: {passwordIssues.join(" · ")}
                        </div>
                      )}

                      <div className="mt-5 flex items-center justify-end">
                        <button
                          type="button"
                          onClick={handlePasswordChange}
                          disabled={savingPassword}
                          className={cx(
                            "px-4 py-3 rounded-xl font-semibold transition inline-flex items-center gap-2",
                            savingPassword
                              ? "bg-white/10 text-white/40 cursor-not-allowed"
                              : "bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white shadow-[0_0_26px_rgba(168,85,247,0.22)] hover:opacity-95"
                          )}
                        >
                          <FiLock />
                          {savingPassword ? "Updating..." : "Update password"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Danger */}
                  {activeTab === "danger" && (
                    <div>
                      <h2 className="text-rose-100 font-semibold text-lg">Danger Zone</h2>
                      <p className="mt-1 text-sm text-white/60">
                        Deleting your account is permanent and cannot be undone.
                      </p>

                      <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-500/10 p-4">
                        <div className="text-sm text-rose-100 font-medium">
                          Delete your account
                        </div>
                        <div className="mt-1 text-sm text-white/65">
                          This removes your account and associated data from Nova.
                        </div>

                        <div className="mt-4 flex items-center justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              setDeleteText("");
                              setShowDeleteModal(true);
                            }}
                            className="px-4 py-3 rounded-xl border border-rose-400/20 bg-rose-500/20 text-rose-100 hover:bg-rose-500/30 transition inline-flex items-center gap-2"
                          >
                            <FiAlertTriangle />
                            Delete my account
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </main>
        </div>

        {/* Delete confirmation */}
        <GlassModal
          open={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete account?"
          subtitle='Type "DELETE" to confirm. This cannot be undone.'
        >
          <div className="space-y-4">
            <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-white/80">
              This action permanently removes your account and data.
            </div>

            <div>
              <label className="text-xs text-white/55 uppercase tracking-wider">
                Confirmation
              </label>
              <input
                value={deleteText}
                onChange={(e) => setDeleteText(e.target.value)}
                placeholder='Type "DELETE"'
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/35 outline-none focus:border-rose-400/40 focus:ring-2 focus:ring-rose-500/20 transition"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-white/90 hover:bg-white/10 transition"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleteText.trim().toUpperCase() !== "DELETE"}
                onClick={async () => {
                  setShowDeleteModal(false);
                  await handleDeleteAccount();
                }}
                className={cx(
                  "px-4 py-2 rounded-xl transition inline-flex items-center gap-2",
                  deleteText.trim().toUpperCase() === "DELETE"
                    ? "border border-rose-400/20 bg-rose-500/20 text-rose-100 hover:bg-rose-500/30"
                    : "bg-white/10 text-white/35 cursor-not-allowed border border-white/10"
                )}
              >
                <FiAlertTriangle />
                Yes, delete
              </button>
            </div>
          </div>
        </GlassModal>

        {/* Logout confirmation */}
        <GlassModal
          open={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          title="Log out?"
          subtitle="You can log back in anytime."
        >
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowLogoutModal(false)}
              className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-white/90 hover:bg-white/10 transition"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => {
                setShowLogoutModal(false);
                handleLogout();
              }}
              className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-white/90 hover:bg-white/10 transition inline-flex items-center gap-2"
            >
              <FiLogOut />
              Log out
            </button>
          </div>
        </GlassModal>
      </div>
    </div>
  );
}
