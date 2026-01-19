import { Link, useNavigate } from "react-router-dom";
import novaLogo from "../assets/nova_logo.png";


export default function Homepage() {
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#05060a] text-white">
      {/* Background layers */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(168,85,247,0.25),transparent_35%),radial-gradient(circle_at_75%_25%,rgba(59,130,246,0.14),transparent_38%),radial-gradient(circle_at_60%_80%,rgba(236,72,153,0.10),transparent_40%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#05060a] via-[#070816] to-[#05060a]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:48px_48px]" />
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <button
            onClick={scrollToTop}
            className="flex items-center gap-3 group"
          >
            <div className="h-9 w-9 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_22px_rgba(168,85,247,0.20)] flex items-center justify-center overflow-hidden">
              <img
                src={novaLogo}
                alt="Nova logo"
                className="h-6 w-6 object-contain"
              />
            </div>
            <span className="text-lg font-semibold tracking-tight text-white/95 group-hover:text-white">
              Nova
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-7 text-sm text-white/75">
            <button onClick={scrollToTop} className="hover:text-white transition">
              Home
            </button>
            <a href="#features" className="hover:text-white transition">
              Features
            </a>
            <a href="#pricing" className="hover:text-white transition">
              Pricing
            </a>
            <a href="#about" className="hover:text-white transition">
              About
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden sm:inline-flex px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-white/90 hover:bg-white/10 transition"
            >
              Log in
            </Link>
            <button
              onClick={() => navigate("/register")}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white font-semibold shadow-[0_0_26px_rgba(168,85,247,0.25)] hover:opacity-95 transition"
            >
              Get started
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-6 pt-16 pb-12 md:pt-24 md:pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.7)]" />
                AI marketing assistant for modern SMBs
              </div>

              <h1 className="mt-6 text-4xl md:text-5xl font-semibold tracking-tight leading-[1.1]">
                Create campaigns,
                <span className="bg-gradient-to-r from-purple-300 via-fuchsia-300 to-purple-200 bg-clip-text text-transparent">
                  {" "}
                  ads, and ideas{" "}
                </span>
                at startup speed.
              </h1>

              <p className="mt-5 text-white/70 text-base md:text-lg max-w-xl">
                Nova helps small teams write high-converting copy, generate ad
                creatives, and turn trend signals into actionable marketing
                moves — all in one dashboard.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate("/register")}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white font-semibold shadow-[0_0_26px_rgba(168,85,247,0.25)] hover:opacity-95 transition"
                >
                  Start free
                </button>

                <Link
                  to="/login"
                  className="px-5 py-3 rounded-xl border border-white/10 bg-white/5 text-white/90 hover:bg-white/10 transition text-center"
                >
                  Go to dashboard
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-4 max-w-lg">
                {[
                  { k: "Copy", v: "Ads, emails, landing sections" },
                  { k: "Creatives", v: "Image generation + reuse" },
                  { k: "Trends", v: "Signals → ideas → angles" },
                ].map((item) => (
                  <div
                    key={item.k}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl"
                  >
                    <div className="text-sm font-semibold">{item.k}</div>
                    <div className="mt-1 text-xs text-white/65">{item.v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right */}
            <div className="relative">
              <div className="absolute -inset-4 rounded-[28px] bg-gradient-to-br from-purple-500/20 to-fuchsia-500/10 blur-2xl" />
              <div className="relative rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl p-4 shadow-[0_0_60px_rgba(168,85,247,0.10)]">
                <div className="rounded-2xl border border-white/10 bg-black/30 overflow-hidden">
                  <img
                    src="/src/assets/homepage_image.png"
                    alt="Nova dashboard preview"
                    className="w-full h-auto object-cover"
                  />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs text-white/60">Output</div>
                    <div className="mt-1 text-sm font-semibold">
                      10 ad variants in seconds
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs text-white/60">Workflow</div>
                    <div className="mt-1 text-sm font-semibold">
                      Save → reuse → scale
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* subtle divider glow */}
        <div className="mx-auto max-w-7xl px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Everything you need to ship marketing faster
          </h2>
          <p className="mt-3 text-white/70">
            Built for small teams that want clarity, speed, and consistent
            output — without adding headcount.
          </p>
        </div>

        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {[
            {
              title: "Copy that converts",
              desc: "Generate hooks, headlines, primary text, CTAs, and landing sections — tuned for platform and intent.",
            },
            {
              title: "Creative generation",
              desc: "Turn prompts into ad images. Save results, organize assets, and reuse what performs.",
            },
            {
              title: "Trend intelligence",
              desc: "Get signals from the web, then translate them into angles, ideas, and campaign plays.",
            },
            {
              title: "Competitor inspiration",
              desc: "Build a swipe file from competitor angles and turn insights into your own original creative direction.",
            },
            {
              title: "Campaign planning",
              desc: "Draft campaign structures, timelines, and deliverables — then execute from one workspace.",
            },
            {
              title: "Credits & control",
              desc: "Clear usage controls, predictable billing, and an experience that scales as your needs grow.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl hover:bg-white/7 transition"
            >
              <h3 className="text-base font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-white/70 leading-relaxed">
                {f.desc}
              </p>
              <div className="mt-4 h-px bg-white/10" />
              <div className="mt-4 text-xs text-white/50">
                Designed for clarity. Built for speed.
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-7xl px-6 pb-16 md:pb-20">
        <div className="max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Simple plans. Clear value.
          </h2>
          <p className="mt-3 text-white/70">
            Start small, scale when you’re ready. No clutter.
          </p>
        </div>

        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {[
            {
              plan: "Starter",
              price: "$0",
              subtitle: "Explore the workflow",
              features: ["Basic copy tools", "Limited trend results", "Small monthly credits"],
              highlight: false,
              cta: "Get started",
            },
            {
              plan: "Pro",
              price: "$29/mo",
              subtitle: "For growing brands",
              features: ["More credits", "Creative generations", "Daily trend ideas"],
              highlight: true,
              cta: "Start Pro",
            },
            {
              plan: "Team",
              price: "Custom",
              subtitle: "For teams & agencies",
              features: ["Team workspaces", "Priority support", "Custom integrations"],
              highlight: false,
              cta: "Talk to us",
            },
          ].map((p) => (
            <div
              key={p.plan}
              className={[
                "rounded-2xl border p-6 backdrop-blur-xl",
                p.highlight
                  ? "border-purple-400/30 bg-gradient-to-b from-purple-500/15 to-white/5 shadow-[0_0_60px_rgba(168,85,247,0.12)]"
                  : "border-white/10 bg-white/5",
              ].join(" ")}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">{p.plan}</h3>
                {p.highlight && (
                  <span className="text-xs px-2 py-1 rounded-full border border-purple-300/30 bg-purple-500/10 text-purple-200">
                    Most popular
                  </span>
                )}
              </div>

              <div className="mt-4">
                <div className="text-3xl font-semibold">{p.price}</div>
                <div className="mt-1 text-sm text-white/60">{p.subtitle}</div>
              </div>

              <ul className="mt-6 space-y-3 text-sm text-white/75">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-300/80" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() =>
                  p.plan === "Team" ? scrollToTop() : navigate("/register")
                }
                className={[
                  "mt-7 w-full px-4 py-3 rounded-xl font-semibold transition",
                  p.highlight
                    ? "bg-gradient-to-r from-purple-500 to-fuchsia-500 shadow-[0_0_26px_rgba(168,85,247,0.25)] hover:opacity-95"
                    : "border border-white/10 bg-white/5 hover:bg-white/10 text-white/90",
                ].join(" ")}
              >
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" className="mx-auto max-w-7xl px-6 pb-20">
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 md:p-10">
          <div className="max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Built for modern marketing execution
            </h2>
            <p className="mt-3 text-white/70 leading-relaxed">
              Nova is a focused workspace for teams that need consistent output:
              copy, creatives, ideas, and campaigns — without jumping between
              tools. The goal is simple: reduce noise, increase velocity, and
              help brands publish with confidence.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate("/register")}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white font-semibold shadow-[0_0_26px_rgba(168,85,247,0.25)] hover:opacity-95 transition"
              >
                Create your account
              </button>
              <Link
                to="/login"
                className="px-5 py-3 rounded-xl border border-white/10 bg-white/5 text-white/90 hover:bg-white/10 transition text-center"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20">
        <div className="mx-auto max-w-7xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-sm text-white/60">
            © {new Date().getFullYear()} Nova. All rights reserved.
          </div>
          <div className="text-sm text-white/60 flex gap-6">
            <a href="#features" className="hover:text-white transition">
              Features
            </a>
            <a href="#pricing" className="hover:text-white transition">
              Pricing
            </a>
            <a href="#about" className="hover:text-white transition">
              About
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
