import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiCheckCircle,
  FiClipboard,
  FiEdit3,
  FiImage,
  FiLayers,
  FiPlus,
  FiSparkles,
  FiTrendingUp,
} from "react-icons/fi";

/**
 * Nova Overview (Command Center)
 * Purpose: move user toward completing Brand Kit + generating real outputs.
 * - No greeting/time/dark mode
 * - Dark futuristic glass UI
 * - CTA-driven: Start Campaign, Finish Brand Kit, Continue work
 */

const CAMPAIGN_GOALS = [
  { key: "sales", label: "Sales / Promotion" },
  { key: "launch", label: "Product Launch" },
  { key: "leads", label: "Leads / Bookings" },
  { key: "retarget", label: "Retargeting" },
];

const PLATFORMS = [
  { key: "meta", label: "Meta (FB/IG)" },
  { key: "tiktok", label: "TikTok" },
  { key: "google", label: "Google Search" },
  { key: "email", label: "Email" },
];

export default function HomeOverview() {
  const navigate = useNavigate();

  // ✅ read "nova_user" first; fallback to old key for safety
  const [user, setUser] = useState({});
  const [brandKit, setBrandKit] = useState(null);

  // Quick generate controls (UI only for now)
  const [goal, setGoal] = useState("sales");
  const [platform, setPlatform] = useState("meta");
  const [prompt, setPrompt] = useState("");

  // Recent activity (mock from localStorage for now)
  const [recent, setRecent] = useState({
    campaigns: [],
    creatives: [],
    trends: [],
  });

  useEffect(() => {
    const u =
      JSON.parse(localStorage.getItem("nova_user")) ||
      JSON.parse(localStorage.getItem("adora_user")) ||
      {};
    setUser(u);

    // Brand Kit: for now read from localStorage (later from backend)
    const kit = JSON.parse(localStorage.getItem("nova_brand_kit")) || null;
    setBrandKit(kit);

    const activity =
      JSON.parse(localStorage.getItem("nova_recent_activity")) || {
        campaigns: [],
        creatives: [],
        trends: [],
      };
    setRecent(activity);
  }, []);

  const firstName = useMemo(() => {
    const n = user?.name || "";
    return n.trim().split(" ")[0] || "there";
  }, [user]);

  const completion = useMemo(() => {
    // Minimal “smart” completion score without needing backend
    if (!brandKit) {
      return { pct: 15, missing: ["Business basics", "Brand voice", "Colors", "Audience"] };
    }

    const missing = [];
    if (!brandKit.businessName) missing.push("Business name");
    if (!brandKit.niche) missing.push("Niche");
    if (!brandKit.tone || !brandKit.tone.length) missing.push("Tone");
    if (!brandKit.colors || brandKit.colors.length < 2) missing.push("Color palette (2+)");
    if (!brandKit.audience) missing.push("Audience");
    if (!brandKit.offer) missing.push("Offer / pricing");
    if (!brandKit.assets || brandKit.assets.length === 0) missing.push("Brand assets (logo/images)");

    const filled = 7 - Math.min(missing.length, 7);
    const pct = Math.max(10, Math.min(100, Math.round((filled / 7) * 100)));

    return { pct, missing };
  }, [brandKit]);

  const startCampaign = () => {
    // For now route to Ads Center (later a dedicated /dashboard/campaign-builder)
    navigate("/dashboard/ads");
  };

  const finishBrandKit = () => {
    // We'll build this page next: /dashboard/brand-kit
    // For now route to settings as placeholder
    navigate("/dashboard/settings");
  };

  const runQuickGenerate = () => {
    if (!prompt.trim()) return;

    // Save minimal activity so Overview feels alive
    const next = {
      ...recent,
      campaigns: [
        {
          id: crypto.randomUUID?.() || String(Date.now()),
          title: prompt.slice(0, 42),
          goal,
          platform,
          at: new Date().toISOString(),
        },
        ...recent.campaigns,
      ].slice(0, 5),
    };

    localStorage.setItem("nova_recent_activity", JSON.stringify(next));
    setRecent(next);

    // Hand off to Ads Center with prefilled context (later)
    // For now just store draft in localStorage
    localStorage.setItem(
      "nova_draft_generation",
      JSON.stringify({ prompt, goal, platform })
    );

    navigate("/dashboard/ads");
  };

  return (
    <div className="min-h-screen px-6 py-8">
      {/* Top headline */}
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.7)]" />
              Nova Command Center
            </div>
            <h1 className="mt-4 text-2xl md:text-3xl font-semibold tracking-tight text-white">
              Create real marketing output — fast.
            </h1>
            <p className="mt-2 text-white/65 text-sm md:text-base max-w-2xl">
              Nova learns your brand + niche so every campaign, copy, and creative feels consistent.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={finishBrandKit}
              className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-white/90 hover:bg-white/10 transition"
            >
              Brand Kit
            </button>
            <button
              onClick={startCampaign}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white font-semibold shadow-[0_0_26px_rgba(168,85,247,0.22)] hover:opacity-95 transition inline-flex items-center gap-2"
            >
              <FiPlus />
              Start Campaign
            </button>
          </div>
        </div>

        {/* Main grid */}
        <div className="mt-8 grid lg:grid-cols-3 gap-5">
          {/* Brand Kit card */}
          <div className="lg:col-span-1 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-[0_0_60px_rgba(168,85,247,0.08)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-white font-semibold text-lg">Brand Kit</div>
                <div className="mt-1 text-sm text-white/65">
                  Teach Nova your business so outputs match your brand.
                </div>
              </div>
              <div className="text-white/70 text-sm inline-flex items-center gap-2">
                <FiCheckCircle />
                {completion.pct}%
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-5 h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-500"
                style={{ width: `${completion.pct}%` }}
              />
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-xs text-white/55 uppercase tracking-wider">
                Missing (recommended)
              </div>
              <ul className="mt-3 space-y-2 text-sm text-white/75">
                {completion.missing.slice(0, 4).map((m) => (
                  <li key={m} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-300/80" />
                    <span>{m}</span>
                  </li>
                ))}
                {completion.missing.length === 0 && (
                  <li className="text-white/70">
                    ✅ Your Brand Kit looks complete.
                  </li>
                )}
              </ul>
            </div>

            <button
              onClick={finishBrandKit}
              className="mt-5 w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold transition inline-flex items-center justify-center gap-2"
            >
              <FiEdit3 />
              Finish Brand Kit
              <FiArrowRight />
            </button>
          </div>

          {/* Quick Generate */}
          <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-[0_0_60px_rgba(168,85,247,0.08)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-white font-semibold text-lg">Quick Generate</div>
                <div className="mt-1 text-sm text-white/65">
                  Describe what you’re promoting. Nova will generate copy + creative direction.
                </div>
              </div>
              <div className="inline-flex items-center gap-2 text-white/70 text-sm">
                <FiSparkles />
                Brand-aware outputs
              </div>
            </div>

            <div className="mt-5 grid md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-xs text-white/55 uppercase tracking-wider">Goal</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {CAMPAIGN_GOALS.map((g) => (
                    <button
                      key={g.key}
                      onClick={() => setGoal(g.key)}
                      className={[
                        "px-3 py-2 rounded-xl text-sm border transition",
                        goal === g.key
                          ? "border-purple-400/30 bg-purple-500/10 text-white"
                          : "border-white/10 bg-white/5 text-white/75 hover:bg-white/10",
                      ].join(" ")}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-xs text-white/55 uppercase tracking-wider">Platform</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p.key}
                      onClick={() => setPlatform(p.key)}
                      className={[
                        "px-3 py-2 rounded-xl text-sm border transition",
                        platform === p.key
                          ? "border-purple-400/30 bg-purple-500/10 text-white"
                          : "border-white/10 bg-white/5 text-white/75 hover:bg-white/10",
                      ].join(" ")}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-xs text-white/55 uppercase tracking-wider">
                What are we promoting?
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                placeholder="Example: Flash sale on handmade candles — 20% off for 48 hours. Target: gift buyers, cozy home lovers."
                className="mt-3 w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/35 outline-none focus:border-purple-400/40 focus:ring-2 focus:ring-purple-500/20 transition"
              />

              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={runQuickGenerate}
                  disabled={!prompt.trim()}
                  className={[
                    "px-5 py-3 rounded-xl font-semibold transition inline-flex items-center justify-center gap-2",
                    prompt.trim()
                      ? "bg-gradient-to-r from-purple-500 to-fuchsia-500 shadow-[0_0_26px_rgba(168,85,247,0.22)] hover:opacity-95 text-white"
                      : "bg-white/10 text-white/40 cursor-not-allowed",
                  ].join(" ")}
                >
                  <FiSparkles />
                  Generate in Ads Center
                  <FiArrowRight />
                </button>

                <button
                  onClick={() => navigate("/dashboard/media")}
                  className="px-5 py-3 rounded-xl border border-white/10 bg-white/5 text-white/90 hover:bg-white/10 transition inline-flex items-center justify-center gap-2"
                >
                  <FiImage />
                  Attach assets first
                </button>
              </div>

              <div className="mt-4 grid sm:grid-cols-3 gap-3">
                {[
                  { icon: <FiClipboard />, title: "Copy pack", sub: "hooks, headlines, primary text" },
                  { icon: <FiImage />, title: "Creative direction", sub: "style + layout + palette" },
                  { icon: <FiLayers />, title: "Campaign plan", sub: "angles + next steps" },
                ].map((x) => (
                  <div
                    key={x.title}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="text-white/85 text-lg">{x.icon}</div>
                    <div className="mt-2 text-sm font-semibold text-white">{x.title}</div>
                    <div className="mt-1 text-xs text-white/60">{x.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent work */}
        <div className="mt-5 grid lg:grid-cols-3 gap-5">
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
            <div className="flex items-center justify-between">
              <div className="text-white font-semibold">Recent Campaign Drafts</div>
              <button
                onClick={() => navigate("/dashboard/ads")}
                className="text-sm text-white/70 hover:text-white transition"
              >
                Open
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {recent.campaigns.length === 0 ? (
                <div className="text-sm text-white/60">
                  No drafts yet. Create your first campaign above.
                </div>
              ) : (
                recent.campaigns.map((c) => (
                  <div
                    key={c.id}
                    className="rounded-2xl border border-white/10 bg-black/20 p-4"
                  >
                    <div className="text-sm text-white font-semibold">
                      {c.title}
                    </div>
                    <div className="mt-1 text-xs text-white/60">
                      Goal: {c.goal} · Platform: {c.platform}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
            <div className="flex items-center justify-between">
              <div className="text-white font-semibold">Saved Creatives</div>
              <button
                onClick={() => navigate("/dashboard/media")}
                className="text-sm text-white/70 hover:text-white transition"
              >
                Library
              </button>
            </div>

            <div className="mt-4 text-sm text-white/65">
              Save your best outputs so Nova can reuse what performs.
            </div>

            <button
              onClick={() => navigate("/dashboard/media")}
              className="mt-5 w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold transition inline-flex items-center justify-center gap-2"
            >
              <FiImage />
              Go to My Media
              <FiArrowRight />
            </button>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
            <div className="flex items-center justify-between">
              <div className="text-white font-semibold">Trend-to-Idea</div>
              <button
                onClick={() => navigate("/dashboard/trends")}
                className="text-sm text-white/70 hover:text-white transition"
              >
                Explore
              </button>
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-center gap-2 text-white/75 text-sm">
                <FiTrendingUp />
                <span>Use trends to generate angles, hooks, and offers.</span>
              </div>
              <div className="mt-2 text-xs text-white/55">
                This becomes smarter once Brand Kit is complete.
              </div>
            </div>

            <button
              onClick={() => navigate("/dashboard/trends")}
              className="mt-5 w-full px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white font-semibold shadow-[0_0_26px_rgba(168,85,247,0.22)] hover:opacity-95 transition inline-flex items-center justify-center gap-2"
            >
              <FiTrendingUp />
              Find Trends
              <FiArrowRight />
            </button>
          </div>
        </div>

        {/* Small personalization line */}
        <div className="mt-6 text-xs text-white/45">
          Logged in as <span className="text-white/65">{firstName}</span>. Nova learns faster when your Brand Kit is complete.
        </div>
      </div>
    </div>
  );
}
