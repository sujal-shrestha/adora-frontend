// src/pages/AIStudio.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import {
  FiZap,
  FiCopy,
  FiRefreshCw,
  FiClock,
  FiAlertTriangle,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";

const TASKS = [
  { key: "meta_ad_variants", label: "Meta Ad Variants" },
  { key: "tiktok_script", label: "TikTok Script" },
  { key: "google_ads", label: "Google Ads" },
  { key: "email_promo", label: "Promo Email" },
  { key: "email_welcome", label: "Welcome Email" },
  { key: "landing_page_section", label: "Landing Page Section" },
  { key: "campaign_plan", label: "Campaign Plan" },
  { key: "angle_bank", label: "Angle Bank" },
  { key: "creative_brief", label: "Creative Brief" },
  { key: "image_prompt", label: "Image Prompt" },
];

const DEFAULT_INPUT = {
  product: "",
  goal: "sales",
  offer: "",
  audienceHint: "",
  angleHint: "",
};

export default function AIStudio() {
  const navigate = useNavigate();

  const [kitLoading, setKitLoading] = useState(true);
  const [brandKit, setBrandKit] = useState(null);

  const [task, setTask] = useState("meta_ad_variants");
  const [input, setInput] = useState(DEFAULT_INPUT);
  const [constraints, setConstraints] = useState({});

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // Output from API
  const [output, setOutput] = useState(null); // structured output (for meta variants cards, etc.)
  const [human, setHuman] = useState(""); // plain-language message (recommended)
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("output"); // output | history
  const [showRaw, setShowRaw] = useState(false);

  // --- Load BrandKit (optional) ---
  useEffect(() => {
    const loadKit = async () => {
      try {
        setKitLoading(true);
        const res = await api.get("/brandkit/me");
        setBrandKit(res.data || null);

        // helpful autofill
        const offer = res.data?.offer || "";
        if (offer) setInput((p) => ({ ...p, offer }));
      } catch (e) {
        setBrandKit(null);
      } finally {
        setKitLoading(false);
      }
    };
    loadKit();
  }, []);

  // --- Load history ---
  const loadHistory = async () => {
    try {
      const res = await api.get("/ai/history");
      setHistory(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  // Brand kit is OPTIONAL
  const brandKitMissing = !brandKit && !kitLoading;

  const taskHelp = useMemo(() => {
    if (task === "meta_ad_variants") return "Generates 5 Meta ad variants (text + headline + CTA).";
    if (task === "campaign_plan") return "Full 7-day plan: angles, creatives, funnel steps, KPIs.";
    if (task === "image_prompt") return "Outputs a clean prompt + negative prompt + ratio.";
    return "Generates output using your inputs (and Brand Kit if available).";
  }, [task]);

  const setField = (k, v) => setInput((p) => ({ ...p, [k]: v }));

  const prettyJSON = (obj) => {
    try {
      return JSON.stringify(obj, null, 2);
    } catch {
      return String(obj);
    }
  };

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(String(text || ""));
      setMsg("Copied ✅");
      setTimeout(() => setMsg(""), 1200);
    } catch {
      setMsg("Couldn’t copy");
      setTimeout(() => setMsg(""), 1200);
    }
  };

  function normalizeApiError(e) {
    const raw = e?.response?.data?.message || e?.message || "Generation failed";

    // Make JSON error non-technical (especially for users)
    if (String(raw).toLowerCase().includes("did not return valid json")) {
      return task === "meta_ad_variants"
        ? "Nova had trouble formatting the Meta variants. Try again (or tweak your input slightly)."
        : "Nova had trouble generating the response. Try again.";
    }

    return raw;
  }

  const generate = async () => {
    try {
      setLoading(true);
      setMsg("");

      // Clear previous output so user doesn’t think it’s “stuck”
      setOutput(null);
      setHuman("");
      setShowRaw(false);

      const res = await api.post("/ai/generate", {
        task,
        input,
        constraints,
      });

      setOutput(res.data?.output || null);
      setHuman(res.data?.message || "");
      setActiveTab("output");

      await loadHistory();
    } catch (e) {
      setMsg(normalizeApiError(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05060a] text-white px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.7)]" />
              AI Studio
            </div>

            <h1 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight">
              Generate copy, strategy, and creative direction — fast.
            </h1>
            <p className="mt-2 text-white/65 max-w-3xl">
              Nova uses your Brand Kit when available — but you can generate without it too.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/dashboard/brandkit")}
              className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-white/90 hover:bg-white/10 transition"
            >
              Edit Brand Kit
            </button>

            <button
              onClick={loadHistory}
              className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-white/90 hover:bg-white/10 transition inline-flex items-center gap-2"
            >
              <FiRefreshCw />
              Refresh
            </button>
          </div>
        </div>

        {/* BrandKit info (NOT a blocker) */}
        {brandKitMissing && (
          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5 flex items-start gap-3">
            <div className="mt-0.5 text-white/70">
              <FiAlertTriangle />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-white">No Brand Kit yet (optional)</div>
              <div className="text-sm text-white/70 mt-1">
                You can still generate. Creating a Brand Kit just makes the output more consistent and business-specific.
              </div>
              <button
                onClick={() => navigate("/dashboard/brandkit")}
                className="mt-3 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white font-semibold hover:opacity-95 transition"
              >
                Create Brand Kit
              </button>
            </div>
          </div>
        )}

        {msg && (
          <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/80">
            {msg}
          </div>
        )}

        {/* Main grid */}
        <div className="mt-6 grid lg:grid-cols-2 gap-5">
          {/* Left: inputs */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 flex flex-col min-h-[520px]">
            <div className="flex items-center justify-between">
              <div className="text-white font-semibold text-lg">Create</div>
              <div className="text-xs text-white/55">{taskHelp}</div>
            </div>

            <div className="mt-5">
              <label className="text-xs text-white/55 uppercase tracking-wider">Task</label>
              <select
                value={task}
                onChange={(e) => setTask(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-purple-400/40 focus:ring-2 focus:ring-purple-500/20 transition"
              >
                {TASKS.map((t) => (
                  <option key={t.key} value={t.key} className="bg-[#0B1220]">
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-5 grid gap-4">
              <div>
                <label className="text-xs text-white/55 uppercase tracking-wider">
                  Product / Service
                </label>
                <input
                  value={input.product}
                  onChange={(e) => setField("product", e.target.value)}
                  placeholder="What are we promoting?"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/35 outline-none focus:border-purple-400/40 focus:ring-2 focus:ring-purple-500/20 transition"
                />
              </div>

              <div>
                <label className="text-xs text-white/55 uppercase tracking-wider">
                  Offer
                </label>
                <input
                  value={input.offer}
                  onChange={(e) => setField("offer", e.target.value)}
                  placeholder="Discount / bundle / trial / guarantee"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/35 outline-none focus:border-purple-400/40 focus:ring-2 focus:ring-purple-500/20 transition"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/55 uppercase tracking-wider">Goal</label>
                  <select
                    value={input.goal}
                    onChange={(e) => setField("goal", e.target.value)}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-purple-400/40 focus:ring-2 focus:ring-purple-500/20 transition"
                  >
                    <option value="sales" className="bg-[#0B1220]">Sales</option>
                    <option value="leads" className="bg-[#0B1220]">Leads</option>
                    <option value="traffic" className="bg-[#0B1220]">Traffic</option>
                    <option value="awareness" className="bg-[#0B1220]">Awareness</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-white/55 uppercase tracking-wider">Angle hint</label>
                  <input
                    value={input.angleHint}
                    onChange={(e) => setField("angleHint", e.target.value)}
                    placeholder="e.g. urgency / social proof"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/35 outline-none focus:border-purple-400/40 focus:ring-2 focus:ring-purple-500/20 transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-white/55 uppercase tracking-wider">Audience hint</label>
                <textarea
                  value={input.audienceHint}
                  onChange={(e) => setField("audienceHint", e.target.value)}
                  rows={3}
                  placeholder="Optional: specific persona or pain point"
                  className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/35 outline-none focus:border-purple-400/40 focus:ring-2 focus:ring-purple-500/20 transition"
                />
              </div>
            </div>

            <button
              onClick={generate}
              disabled={loading}
              className={[
                "mt-6 w-full px-4 py-3 rounded-xl font-semibold transition inline-flex items-center justify-center gap-2",
                loading
                  ? "bg-white/10 text-white/40 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white shadow-[0_0_26px_rgba(168,85,247,0.22)] hover:opacity-95",
              ].join(" ")}
            >
              <FiZap />
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>

          {/* Right: output + history */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
            <div className="flex items-center justify-between">
              <div className="text-white font-semibold text-lg">Results</div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab("output")}
                  className={[
                    "px-3 py-2 rounded-xl text-sm border transition",
                    activeTab === "output"
                      ? "border-purple-400/30 bg-purple-500/10 text-white"
                      : "border-white/10 bg-white/5 text-white/75 hover:bg-white/10",
                  ].join(" ")}
                >
                  Output
                </button>
                <button
                  onClick={() => setActiveTab("history")}
                  className={[
                    "px-3 py-2 rounded-xl text-sm border transition inline-flex items-center gap-2",
                    activeTab === "history"
                      ? "border-purple-400/30 bg-purple-500/10 text-white"
                      : "border-white/10 bg-white/5 text-white/75 hover:bg-white/10",
                  ].join(" ")}
                >
                  <FiClock />
                  History
                </button>
              </div>
            </div>

            {activeTab === "output" && (
                <div className="mt-4 flex-1 overflow-y-auto pr-1">
                {!output ? (
                  <div className="text-sm text-white/60">
                    Generate something to see results here.
                  </div>
                ) : (
                  <>
                    {/* META VARIANTS UI */}
                    {output?.format?.variants ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-white/60">
                            Showing structured variants (ready to paste).
                          </div>
                          <button
                            onClick={() => copyText(human || JSON.stringify(output, null, 2))}
                            className="px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-white/90 hover:bg-white/10 transition inline-flex items-center gap-2 text-sm"
                          >
                            <FiCopy />
                            Copy
                          </button>
                        </div>

                        {output.format.variants.map((v, idx) => (
                          <div
                            key={idx}
                            className="rounded-2xl border border-white/10 bg-black/30 p-4"
                          >
                            <div className="flex items-center justify-between">
                              <div className="text-white font-semibold">Variant {idx + 1}</div>
                              <button
                                onClick={() =>
                                  copyText(
                                    [
                                      `Primary: ${v.primary_text}`,
                                      `Headline: ${v.headline}`,
                                      `Desc: ${v.description}`,
                                      `CTA: ${v.cta}`,
                                      `Angle: ${v.angle}`,
                                    ].join("\n")
                                  )
                                }
                                className="px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-white/90 hover:bg-white/10 transition inline-flex items-center gap-2 text-sm"
                              >
                                <FiCopy />
                                Copy Variant
                              </button>
                            </div>

                            <div className="mt-2 text-sm text-white/80 whitespace-pre-wrap">
                              <div><span className="text-white/50">Primary:</span> {v.primary_text}</div>
                              <div className="mt-1"><span className="text-white/50">Headline:</span> {v.headline}</div>
                              <div className="mt-1"><span className="text-white/50">Desc:</span> {v.description}</div>
                              <div className="mt-1"><span className="text-white/50">CTA:</span> {v.cta}</div>
                              <div className="mt-1"><span className="text-white/50">Angle:</span> {v.angle}</div>
                            </div>
                          </div>
                        ))}

                        {output?.notes ? (
                          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                            {output.notes}
                          </div>
                        ) : null}

                        <button
                          onClick={() => setShowRaw((s) => !s)}
                          className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black/20 text-white/80 hover:bg-white/5 transition inline-flex items-center justify-center gap-2"
                        >
                          {showRaw ? <FiChevronUp /> : <FiChevronDown />}
                          {showRaw ? "Hide Raw JSON" : "View Raw JSON"}
                        </button>

                        {showRaw ? (
                          <pre className="rounded-2xl border border-white/10 bg-black/30 p-4 text-xs text-white/80 whitespace-pre-wrap">
                            {prettyJSON(output)}
                          </pre>
                        ) : null}
                      </div>
                    ) : (
                      /* NORMAL OUTPUT */
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-white/60">
                            Plain-language output (recommended).
                          </div>

                          <button
                            onClick={() => copyText(human || prettyJSON(output))}
                            className="px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-white/90 hover:bg-white/10 transition inline-flex items-center gap-2 text-sm"
                          >
                            <FiCopy />
                            Copy
                          </button>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-black/30 p-4 max-h-[55vh] overflow-y-auto">
                          <div className="text-sm text-white/85 whitespace-pre-wrap break-words">
                            {human || "No text output received. (Toggle Raw JSON below.)"}
                          </div>
                        </div>


                        <button
                          onClick={() => setShowRaw((s) => !s)}
                          className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black/20 text-white/80 hover:bg-white/5 transition inline-flex items-center justify-center gap-2"
                        >
                          {showRaw ? <FiChevronUp /> : <FiChevronDown />}
                          {showRaw ? "Hide Raw JSON" : "View Raw JSON"}
                        </button>

                        {showRaw ? (
                          <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                            <div className="flex justify-end">
                              <button
                                onClick={() => copyText(prettyJSON(output))}
                                className="px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-white/90 hover:bg-white/10 transition inline-flex items-center gap-2 text-sm"
                              >
                                <FiCopy />
                                Copy JSON
                              </button>
                            </div>
                            <pre className="mt-3 text-xs text-white/80 whitespace-pre-wrap">
                              {prettyJSON(output)}
                            </pre>
                          </div>
                        ) : null}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {activeTab === "history" && (
              <div className="mt-4 flex-1 overflow-y-auto pr-1 space-y-3">
                {history.length === 0 ? (
                  <div className="text-sm text-white/60">No history yet.</div>
                ) : (
                  history.map((h) => (
                    <button
                      key={h._id}
                      onClick={() => {
                        setOutput(h.output || null);
                        setHuman(h.message || "");
                        setShowRaw(false);
                        setActiveTab("output");
                      }}
                      className="w-full text-left rounded-2xl border border-white/10 bg-black/30 p-4 hover:bg-white/5 transition"
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-white font-semibold text-sm">{h.task}</div>
                        <div className="text-white/50 text-xs">
                          {new Date(h.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-white/60 line-clamp-2">
                        {h?.message || h?.output?.notes || "Click to open output"}
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer hint */}
        <div className="mt-6 text-xs text-white/45">
          Tip: Brand Kit is optional — but it improves consistency.
        </div>
      </div>
    </div>
  );
}
