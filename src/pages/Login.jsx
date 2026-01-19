import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import novaLogo from "../assets/nova_logo.png";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const canSubmit = useMemo(() => {
    return email.trim().length > 0 && password.length > 0 && !loading;
  }, [email, password, loading]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) return;

    try {
      setLoading(true);

      const response = await fetch("http://localhost:10010/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await response.json();

      if (response.ok) {
        // SAVE TOKEN
        localStorage.setItem("token", data.token);

        // SAVE USER (rename to nova_user)
        localStorage.setItem("nova_user", JSON.stringify(data.user));

        navigate("/dashboard");
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Server error. Please try again in a moment.");
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
              <img src={novaLogo} alt="Nova logo" className="h-7 w-7 object-contain" />
            </div>
            <div>
              <div className="text-white font-semibold leading-tight">Nova</div>
              <div className="text-white/60 text-xs">AI Marketing Assistant</div>
            </div>
          </Link>

          <Link
            to="/register"
            className="text-sm text-white/80 hover:text-white transition"
          >
            Create account
          </Link>
        </div>

        {/* Body */}
        <div className="mt-10 grid lg:grid-cols-2 gap-8 items-stretch">
          {/* Left: form card */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-7 md:p-9 shadow-[0_0_60px_rgba(168,85,247,0.10)]">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-white/65">
              Sign in to your Nova dashboard.
            </p>

            {error && (
              <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs text-white/60 mb-2">Email</label>
                <input
                  type="email"
                  placeholder="you@company.com"
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/35 outline-none focus:border-purple-400/40 focus:ring-2 focus:ring-purple-500/20 transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-white/60 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 pr-12 text-white placeholder:text-white/35 outline-none focus:border-purple-400/40 focus:ring-2 focus:ring-purple-500/20 transition"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
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

              <div className="flex items-center justify-between">
                <Link
                  to="/forgot-password"
                  className="text-sm text-white/70 hover:text-white transition"
                >
                  Forgot password?
                </Link>
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
                {loading ? "Signing in..." : "Sign in"}
              </button>

              <p className="text-sm text-white/65">
                Don’t have an account?{" "}
                <Link
                  to="/register"
                  className="text-white hover:underline underline-offset-4"
                >
                  Sign up
                </Link>
              </p>
            </form>

            <div className="mt-6 flex items-center gap-4 text-xs text-white/45">
              <Link to="/terms" className="hover:text-white/70 transition">
                Terms
              </Link>
              <Link to="/privacy" className="hover:text-white/70 transition">
                Privacy
              </Link>
            </div>
          </div>

          {/* Right: minimal product panel */}
          <div className="hidden lg:block rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-white/0 backdrop-blur-xl p-9">
            <div className="text-sm text-white/60">Inside Nova</div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              Ship marketing faster — with less noise.
            </h2>
            <p className="mt-3 text-sm text-white/65 leading-relaxed max-w-md">
              Generate ad creatives, write campaign copy, store assets, and turn
              trend signals into actionable ideas — all from one workspace.
            </p>

            <div className="mt-7 grid gap-4">
              {[
                { title: "Ads Center", desc: "Generate images + prompts, keep history, reuse winners." },
                { title: "Trends", desc: "Search a niche and instantly get angles + ideas." },
                { title: "My Media", desc: "Organize creatives, copy URLs, and reuse across campaigns." },
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
              Tip: After logging in, open Ads Center and generate a few creatives to
              see Nova’s workflow end-to-end.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
