import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import axios from "axios";
import novaLogo from "../assets/nova_logo.png";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const canSubmit = useMemo(() => {
    return (
      form.name.trim().length > 0 &&
      form.email.trim().length > 0 &&
      form.password.length >= 6 &&
      !loading
    );
  }, [form, loading]);

  const handleChange = (e) => {
    setError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      await axios.post("http://localhost:10010/api/auth/register", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      navigate("/login");
    } catch (err) {
      console.error(err.response?.data || err);
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05060a] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(168,85,247,0.25),transparent_35%),radial-gradient(circle_at_75%_25%,rgba(59,130,246,0.14),transparent_38%),radial-gradient(circle_at_60%_80%,rgba(236,72,153,0.10),transparent_40%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#05060a] via-[#070816] to-[#05060a]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:48px_48px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_24px_rgba(168,85,247,0.20)] flex items-center justify-center overflow-hidden">
              <img
                src={novaLogo}
                alt="Nova logo"
                className="h-7 w-7 object-contain"
              />
            </div>
            <div>
              <div className="text-white font-semibold leading-tight">Nova</div>
              <div className="text-white/60 text-xs">AI Marketing Assistant</div>
            </div>
          </Link>

          <Link to="/login" className="text-sm text-white/80 hover:text-white transition">
            Sign in
          </Link>
        </div>

        {/* Body */}
        <div className="mt-10 grid lg:grid-cols-2 gap-8 items-stretch">
          {/* Left: form card */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-7 md:p-9 shadow-[0_0_60px_rgba(168,85,247,0.10)]">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-white/65">
              Start building campaigns and creatives in minutes.
            </p>

            {error && (
              <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs text-white/60 mb-2">Full name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/35 outline-none focus:border-purple-400/40 focus:ring-2 focus:ring-purple-500/20 transition"
                  autoComplete="name"
                />
              </div>

              <div>
                <label className="block text-xs text-white/60 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@company.com"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/35 outline-none focus:border-purple-400/40 focus:ring-2 focus:ring-purple-500/20 transition"
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="block text-xs text-white/60 mb-2">
                  Password
                  <span className="ml-2 text-white/40">(min 6 chars)</span>
                </label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    required
                    value={form.password}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 pr-12 text-white placeholder:text-white/35 outline-none focus:border-purple-400/40 focus:ring-2 focus:ring-purple-500/20 transition"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/60 hover:text-white transition"
                  >
                    {showPw ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={!canSubmit}
                className={[
                  "w-full rounded-xl px-5 py-3 font-semibold transition",
                  canSubmit
                    ? "bg-gradient-to-r from-purple-500 to-fuchsia-500 shadow-[0_0_26px_rgba(168,85,247,0.25)] hover:opacity-95"
                    : "bg-white/10 text-white/40 cursor-not-allowed",
                ].join(" ")}
              >
                {loading ? "Creating account..." : "Create account"}
              </button>

              <p className="text-xs text-white/50 leading-relaxed">
                By continuing, you agree to Nova’s{" "}
                <Link to="/terms" className="text-white/80 hover:text-white underline underline-offset-4">
                  Terms
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-white/80 hover:text-white underline underline-offset-4">
                  Privacy Policy
                </Link>
                .
              </p>

              <p className="text-sm text-white/65">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-white hover:underline underline-offset-4"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </div>

          {/* Right: minimal value panel */}
          <div className="hidden lg:block rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-white/0 backdrop-blur-xl p-9">
            <div className="text-sm text-white/60">Why Nova</div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              A focused workspace for real marketing output.
            </h2>
            <p className="mt-3 text-sm text-white/65 leading-relaxed max-w-md">
              Copy, creatives, trends, and campaigns — designed to reduce noise and
              help you ship faster with consistent quality.
            </p>

            <div className="mt-7 grid gap-4">
              {[
                { title: "Clean workflow", desc: "Generate → save → reuse → scale." },
                { title: "Trends to ideas", desc: "Signals transformed into angles and hooks." },
                { title: "Built for SMBs", desc: "Fast, simple, and practical." },
              ].map((x) => (
                <div
                  key={x.title}
                  className="rounded-2xl border border-white/10 bg-black/20 p-5"
                >
                  <div className="text-white font-semibold">{x.title}</div>
                  <div className="mt-1 text-sm text-white/65">{x.desc}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 h-px bg-white/10" />
            <div className="mt-6 text-xs text-white/45">
              After creating your account, head to Ads Center and generate your first creative.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
