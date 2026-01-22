import { Link, useNavigate } from "react-router-dom";
import novaLogo from "../assets/nova_logo.png";

export default function Homepage() {
  const navigate = useNavigate();

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="min-h-screen bg-[#05060a] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(168,85,247,0.28),transparent_38%),radial-gradient(circle_at_78%_20%,rgba(59,130,246,0.14),transparent_42%),radial-gradient(circle_at_60%_82%,rgba(236,72,153,0.10),transparent_40%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#05060a] via-[#070816] to-[#05060a]" />
        <div className="absolute inset-0 opacity-[0.075] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:56px_56px]" />
      </div>

      {/* Top Nav */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <button onClick={scrollToTop} className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_24px_rgba(168,85,247,0.18)] flex items-center justify-center overflow-hidden">
              <img src={novaLogo} alt="Nova logo" className="h-7 w-7 object-contain" />
            </div>
            <div className="leading-tight">
              <div className="text-white font-semibold tracking-tight">Nova</div>
              <div className="text-white/55 text-xs">AI Marketing Assistant</div>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-7 text-sm text-white/70">
            <a href="#workflow" className="hover:text-white transition">Workflow</a>
            <a href="#use-cases" className="hover:text-white transition">Use cases</a>
            <a href="#plans" className="hover:text-white transition">Plans</a>
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
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white font-semibold shadow-[0_0_26px_rgba(168,85,247,0.22)] hover:opacity-95 transition"
            >
              Get started
            </button>
          </div>
        </div>
      </header>

      {/* HERO — new style */}
      <section className="mx-auto max-w-7xl px-6 pt-14 md:pt-20 pb-14">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left copy */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.7)]" />
              Build marketing outputs, not busywork
            </div>

            <h1 className="mt-6 text-4xl md:text-5xl font-semibold tracking-tight leading-[1.1]">
              A clean workspace for{" "}
              <span className="bg-gradient-to-r from-purple-300 via-fuchsia-300 to-purple-200 bg-clip-text text-transparent">
                ideas → campaigns → creatives
              </span>
              .
            </h1>

            <p className="mt-5 text-white/70 text-base md:text-lg max-w-xl">
              Nova turns prompts and trend signals into real marketing deliverables —
              copy, ad creatives, and campaign structure — in a single dashboard.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate("/register")}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white font-semibold shadow-[0_0_26px_rgba(168,85,247,0.22)] hover:opacity-95 transition"
              >
                Start free
              </button>
              <Link
                to="/login"
                className="px-5 py-3 rounded-xl border border-white/10 bg-white/5 text-white/90 hover:bg-white/10 transition text-center"
              >
                Open dashboard
              </Link>
            </div>

            {/* compact chips */}
            <div className="mt-10 flex flex-wrap gap-2">
              {[
                "Ad copy",
                "Email campaigns",
                "Landing sections",
                "Ad image generation",
                "Trend-to-angle ideas",
                "Swipe file / inspiration",
              ].map((x) => (
                <span
                  key={x}
                  className="text-xs text-white/70 border border-white/10 bg-white/5 px-3 py-1.5 rounded-full"
                >
                  {x}
                </span>
              ))}
            </div>
          </div>

          {/* Right: cinematic product panel */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-[32px] bg-gradient-to-br from-purple-500/20 to-fuchsia-500/10 blur-2xl" />
            <div className="relative rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-xl p-5 shadow-[0_0_70px_rgba(168,85,247,0.10)]">
              {/* fake “app window” header */}
              <div className="flex items-center justify-between pb-4">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                </div>
                <div className="text-xs text-white/55">Nova / Overview</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 overflow-hidden">
                <img
                  src="/src/assets/homepage_image.png"
                  alt="Nova dashboard preview"
                  className="w-full h-auto object-cover"
                />
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  { k: "Generate", v: "Copy + creatives" },
                  { k: "Organize", v: "Assets + history" },
                  { k: "Execute", v: "Campaign plans" },
                ].map((c) => (
                  <div
                    key={c.k}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="text-xs text-white/60">{c.k}</div>
                    <div className="mt-1 text-sm font-semibold">{c.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      </section>

      {/* WORKFLOW instead of “features” */}
      <section id="workflow" className="mx-auto max-w-7xl px-6 py-14 md:py-18">
        <div className="max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            The workflow is the product
          </h2>
          <p className="mt-3 text-white/70">
            Nova is designed around output. Each step moves you closer to a finished campaign.
          </p>
        </div>

        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {[
            {
              step: "01",
              title: "Ask",
              desc: "Describe the offer, the audience, and the platform. Nova keeps it structured.",
            },
            {
              step: "02",
              title: "Generate",
              desc: "Get multiple copy variants, angles, and visual directions — ready to pick from.",
            },
            {
              step: "03",
              title: "Ship",
              desc: "Save outputs, reuse assets, and build a consistent library you can scale.",
            },
          ].map((x) => (
            <div
              key={x.step}
              className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-7 hover:bg-white/7 transition"
            >
              <div className="text-xs text-white/55">STEP {x.step}</div>
              <div className="mt-2 text-lg font-semibold">{x.title}</div>
              <p className="mt-2 text-sm text-white/70 leading-relaxed">{x.desc}</p>
              <div className="mt-6 h-px bg-white/10" />
              <div className="mt-4 text-xs text-white/45">
                Minimal inputs. High leverage outputs.
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* USE CASES strip */}
      <section id="use-cases" className="mx-auto max-w-7xl px-6 py-14">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/6 to-white/0 backdrop-blur-xl p-8 md:p-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="max-w-2xl">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                Built for SMB marketing realities
              </h2>
              <p className="mt-3 text-white/70">
                When you’re moving fast, you don’t need “more tools.” You need fewer steps.
              </p>
            </div>
            <button
              onClick={() => navigate("/register")}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white font-semibold shadow-[0_0_26px_rgba(168,85,247,0.22)] hover:opacity-95 transition"
            >
              Start building
            </button>
          </div>

          <div className="mt-10 grid md:grid-cols-3 gap-5">
            {[
              { title: "E-commerce", desc: "Promo campaigns, product launches, retention emails." },
              { title: "Local businesses", desc: "Offers, social content, seasonal pushes that convert." },
              { title: "Agencies", desc: "Faster drafts, reusable assets, client-ready deliverables." },
            ].map((u) => (
              <div key={u.title} className="rounded-2xl border border-white/10 bg-black/20 p-6">
                <div className="text-white font-semibold">{u.title}</div>
                <div className="mt-2 text-sm text-white/70">{u.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLANS (minimal) */}
      <section id="plans" className="mx-auto max-w-7xl px-6 py-14 md:py-18">
        <div className="max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Plans that scale with your output
          </h2>
          <p className="mt-3 text-white/70">
            Keep it simple. Upgrade when you’re using Nova daily.
          </p>
        </div>

        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {[
            {
              plan: "Starter",
              price: "$0",
              subtitle: "Explore the workflow",
              features: ["Basic copy tools", "Limited generations", "Starter credits"],
              highlight: false,
              cta: "Start free",
            },
            {
              plan: "Pro",
              price: "$29/mo",
              subtitle: "For growing brands",
              features: ["More credits", "Creative generations", "Daily trend ideas"],
              highlight: true,
              cta: "Go Pro",
            },
            {
              plan: "Team",
              price: "Custom",
              subtitle: "For teams & agencies",
              features: ["Team workspaces", "Priority support", "Custom integrations"],
              highlight: false,
              cta: "Contact",
            },
          ].map((p) => (
            <div
              key={p.plan}
              className={[
                "rounded-3xl border p-7 backdrop-blur-xl",
                p.highlight
                  ? "border-purple-400/30 bg-gradient-to-b from-purple-500/15 to-white/5 shadow-[0_0_70px_rgba(168,85,247,0.12)]"
                  : "border-white/10 bg-white/5",
              ].join(" ")}
            >
              <div className="flex items-center justify-between">
                <div className="text-white font-semibold">{p.plan}</div>
                {p.highlight && (
                  <span className="text-xs px-2 py-1 rounded-full border border-purple-300/30 bg-purple-500/10 text-purple-200">
                    Popular
                  </span>
                )}
              </div>

              <div className="mt-4 text-3xl font-semibold">{p.price}</div>
              <div className="mt-1 text-sm text-white/60">{p.subtitle}</div>

              <ul className="mt-6 space-y-3 text-sm text-white/75">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-300/80" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => navigate("/register")}
                className={[
                  "mt-7 w-full px-4 py-3 rounded-xl font-semibold transition",
                  p.highlight
                    ? "bg-gradient-to-r from-purple-500 to-fuchsia-500 shadow-[0_0_26px_rgba(168,85,247,0.22)] hover:opacity-95"
                    : "border border-white/10 bg-white/5 hover:bg-white/10 text-white/90",
                ].join(" ")}
              >
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20">
        <div className="mx-auto max-w-7xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-sm text-white/60">
            © {new Date().getFullYear()} Nova.
          </div>
          <div className="text-sm text-white/60 flex gap-6">
            <a href="#workflow" className="hover:text-white transition">Workflow</a>
            <a href="#use-cases" className="hover:text-white transition">Use cases</a>
            <a href="#plans" className="hover:text-white transition">Plans</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
