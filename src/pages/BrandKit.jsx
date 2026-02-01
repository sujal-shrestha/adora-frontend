// src/pages/BrandKit.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiCopy,
  FiPlus,
  FiSave,
  FiZap,
  FiTrash2,
  FiX,
} from "react-icons/fi";

const NICHES = [
  "E-commerce",
  "Fashion",
  "Beauty",
  "Fitness",
  "Food & Beverage",
  "Local Business",
  "Real Estate",
  "Education",
  "SaaS",
  "Agency",
  "Finance",
  "Other",
];

const TONE_OPTIONS = [
  "Bold",
  "Professional",
  "Friendly",
  "Playful",
  "Luxury",
  "Minimal",
  "Witty",
  "Direct-response",
  "Trust-building",
];

const PLATFORM_OPTIONS = ["Meta", "TikTok", "Google", "Email"];

const DEFAULT_KIT = {
  businessName: "",
  niche: "",
  tagline: "",
  tones: [],
  audience: "",
  offer: "",
  usps: [""],
  claimsAllowed: [""],
  wordsToUse: "",
  wordsToAvoid: "",
  colors: ["#A855F7", "#EC4899", "#0B1220"],
  styleNotes: "Futuristic, minimal, glass, purple neon",
  competitors: [""],
  platforms: [],
};

function clampPalette(colors) {
  const cleaned = (colors || [])
    .map((c) => (c || "").trim())
    .filter(Boolean);
  return cleaned.slice(0, 5);
}

export default function BrandKit() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const [kit, setKit] = useState(DEFAULT_KIT);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.get("/brandkit/me");
        const bk = res.data?.brandKit || {};

        setKit((prev) => ({
          ...prev,
          ...DEFAULT_KIT,
          ...bk,
          tones: Array.isArray(bk.tones) ? bk.tones : [],
          usps: Array.isArray(bk.usps) ? (bk.usps.length ? bk.usps : [""]) : [""],
          claimsAllowed: Array.isArray(bk.claimsAllowed)
            ? bk.claimsAllowed.length
              ? bk.claimsAllowed
              : [""]
            : [""],
          competitors: Array.isArray(bk.competitors)
            ? bk.competitors.length
              ? bk.competitors
              : [""]
            : [""],
          platforms: Array.isArray(bk.platforms) ? bk.platforms : [],
          colors: Array.isArray(bk.colors)
            ? bk.colors.length
              ? bk.colors
              : DEFAULT_KIT.colors
            : DEFAULT_KIT.colors,
        }));
      } catch (e) {
        console.error("BrandKit load error:", e);
        setMsg("Failed to load Brand Kit.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const completion = useMemo(() => {
    const missing = [];
    if (!kit.businessName?.trim()) missing.push("Business name");
    if (!kit.niche?.trim()) missing.push("Niche");
    if (!kit.tones?.length) missing.push("Tone");
    if (!kit.audience?.trim()) missing.push("Audience");
    if (!kit.offer?.trim()) missing.push("Offer");

    const palette = clampPalette(kit.colors);
    if (palette.length < 2) missing.push("Colors (2+)");

    const filled = 6 - Math.min(missing.length, 6);
    const pct = Math.round((filled / 6) * 100);

    return { pct, missing };
  }, [kit]);

  const setField = (key, value) => setKit((k) => ({ ...k, [key]: value }));

  const toggleTone = (tone) => {
    setKit((k) => {
      const exists = k.tones.includes(tone);
      const next = exists ? k.tones.filter((t) => t !== tone) : [...k.tones, tone];
      return { ...k, tones: next };
    });
  };

  const togglePlatform = (p) => {
    setKit((k) => {
      const exists = k.platforms.includes(p);
      const next = exists ? k.platforms.filter((x) => x !== p) : [...k.platforms, p];
      return { ...k, platforms: next };
    });
  };

  const updateListItem = (key, idx, value) => {
    setKit((k) => {
      const list = Array.isArray(k[key]) ? [...k[key]] : [""];
      list[idx] = value;
      return { ...k, [key]: list };
    });
  };

  const addListItem = (key) => {
    setKit((k) => {
      const list = Array.isArray(k[key]) ? [...k[key]] : [];
      return { ...k, [key]: [...list, ""] };
    });
  };

  const removeListItem = (key, idx) => {
    setKit((k) => {
      const list = Array.isArray(k[key]) ? [...k[key]] : [""];
      const next = list.filter((_, i) => i !== idx);
      return { ...k, [key]: next.length ? next : [""] };
    });
  };

  const save = async () => {
    try {
      setSaving(true);
      setMsg("");

      const payload = {
        ...kit,
        colors: clampPalette(kit.colors),
        usps: (kit.usps || []).map((x) => x.trim()).filter(Boolean),
        claimsAllowed: (kit.claimsAllowed || []).map((x) => x.trim()).filter(Boolean),
        competitors: (kit.competitors || []).map((x) => x.trim()).filter(Boolean),
      };

      const res = await api.put("/brandkit/me", payload);

      setKit((k) => ({
        ...k,
        ...(res.data?.brandKit || {}),
      }));

      setMsg("Brand Kit saved ✅");
      setTimeout(() => setMsg(""), 2500);
    } catch (e) {
      console.error("BrandKit save error:", e);
      setMsg(e?.response?.data?.message || "Failed to save Brand Kit.");
    } finally {
      setSaving(false);
    }
  };

  const copyPalette = async () => {
    const palette = clampPalette(kit.colors).join(", ");
    try {
      await navigator.clipboard.writeText(palette);
      setMsg("Palette copied ✅");
      setTimeout(() => setMsg(""), 2000);
    } catch {
      setMsg("Couldn’t copy palette.");
    }
  };

  return (
    <div className="min-h-screen bg-[#05060a] text-white px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Top bar */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>

            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.7)]" />
              Business Brain
            </div>

            <h1 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight text-white">
              Brand Kit
            </h1>
            <p className="mt-2 text-white/65 max-w-2xl">
              Nova uses this to generate copy, campaigns, and ad creatives that match your business.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-sm text-white/70">
              <FiCheckCircle />
              {completion.pct}% complete
            </div>

            <button
              onClick={save}
              disabled={saving}
              className={[
                "px-4 py-2 rounded-xl font-semibold transition inline-flex items-center gap-2",
                saving
                  ? "bg-white/10 text-white/40 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white shadow-[0_0_26px_rgba(168,85,247,0.22)] hover:opacity-95",
              ].join(" ")}
            >
              <FiSave />
              {saving ? "Saving..." : "Save Brand Kit"}
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="text-white/80 text-sm">
              Completion helps Nova stay consistent.
            </div>
            <div className="text-white/70 text-sm inline-flex items-center gap-2">
              <FiZap />
              Output quality ↑
            </div>
          </div>

          <div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-500"
              style={{ width: `${completion.pct}%` }}
            />
          </div>

          {completion.missing.length > 0 && (
            <div className="mt-3 text-xs text-white/55">
              Missing: {completion.missing.join(" · ")}
            </div>
          )}
        </div>

        {msg && (
          <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/80">
            {msg}
          </div>
        )}

        {loading && <div className="mt-4 text-sm text-white/60">Loading Brand Kit…</div>}

        {/* Content */}
        <div className="mt-6 grid lg:grid-cols-3 gap-5">
          {/* Left */}
          <div className="lg:col-span-2 space-y-5">
            {/* Core */}
            <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
              <h2 className="text-white font-semibold text-lg">Core</h2>
              <p className="mt-1 text-sm text-white/60">
                The minimum Nova needs to generate useful output.
              </p>

              <div className="mt-5 grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/55 uppercase tracking-wider">
                    Business Name
                  </label>
                  <input
                    value={kit.businessName}
                    onChange={(e) => setField("businessName", e.target.value)}
                    placeholder="e.g. Duval Fits"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/35 outline-none focus:border-purple-400/40 focus:ring-2 focus:ring-purple-500/20 transition"
                  />
                </div>

                <div>
                  <label className="text-xs text-white/55 uppercase tracking-wider">
                    Niche
                  </label>
                  <select
                    value={kit.niche}
                    onChange={(e) => setField("niche", e.target.value)}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-purple-400/40 focus:ring-2 focus:ring-purple-500/20 transition"
                  >
                    <option value="" className="bg-[#0B1220]">
                      Select niche
                    </option>
                    {NICHES.map((n) => (
                      <option key={n} value={n} className="bg-[#0B1220]">
                        {n}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs text-white/55 uppercase tracking-wider">
                    Tagline (optional)
                  </label>
                  <input
                    value={kit.tagline}
                    onChange={(e) => setField("tagline", e.target.value)}
                    placeholder="One-liner describing what you do"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/35 outline-none focus:border-purple-400/40 focus:ring-2 focus:ring-purple-500/20 transition"
                  />
                </div>
              </div>

              <div className="mt-5">
                <label className="text-xs text-white/55 uppercase tracking-wider">
                  Tone (pick 2–3)
                </label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {TONE_OPTIONS.map((t) => {
                    const active = kit.tones.includes(t);
                    return (
                      <button
                        key={t}
                        onClick={() => toggleTone(t)}
                        type="button"
                        className={[
                          "px-3 py-2 rounded-xl text-sm border transition",
                          active
                            ? "border-purple-400/30 bg-purple-500/10 text-white"
                            : "border-white/10 bg-white/5 text-white/75 hover:bg-white/10",
                        ].join(" ")}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-5 grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/55 uppercase tracking-wider">
                    Audience (who + pain)
                  </label>
                  <textarea
                    value={kit.audience}
                    onChange={(e) => setField("audience", e.target.value)}
                    rows={4}
                    placeholder="Who is the customer? What do they want? What do they struggle with?"
                    className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/35 outline-none focus:border-purple-400/40 focus:ring-2 focus:ring-purple-500/20 transition"
                  />
                </div>

                <div>
                  <label className="text-xs text-white/55 uppercase tracking-wider">
                    Offer (what are we selling?)
                  </label>
                  <textarea
                    value={kit.offer}
                    onChange={(e) => setField("offer", e.target.value)}
                    rows={4}
                    placeholder="Price, promo, guarantee, delivery, trial, bundle etc."
                    className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/35 outline-none focus:border-purple-400/40 focus:ring-2 focus:ring-purple-500/20 transition"
                  />
                </div>
              </div>
            </section>

            {/* Positioning */}
            <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
              <h2 className="text-white font-semibold text-lg">Positioning</h2>
              <p className="mt-1 text-sm text-white/60">
                This is what makes Nova output feel specific instead of generic.
              </p>

              <div className="mt-4">
                <label className="text-xs text-white/55 uppercase tracking-wider">
                  Unique Selling Points (USPs)
                </label>

                <div className="mt-3 space-y-3">
                  {kit.usps.map((v, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        value={v}
                        onChange={(e) => updateListItem("usps", idx, e.target.value)}
                        placeholder="e.g. Free worldwide shipping over $100"
                        className="flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/35 outline-none focus:border-purple-400/40 focus:ring-2 focus:ring-purple-500/20 transition"
                      />
                      <button
                        type="button"
                        onClick={() => removeListItem("usps", idx)}
                        className="px-3 rounded-xl border border-white/10 bg-white/5 text-white/75 hover:bg-white/10 transition"
                        title="Remove"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => addListItem("usps")}
                  className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-white/90 hover:bg-white/10 transition"
                >
                  <FiPlus />
                  Add USP
                </button>
              </div>

              <div className="mt-6">
                <label className="text-xs text-white/55 uppercase tracking-wider">
                  Claims Allowed (compliance-safe)
                </label>
                <div className="mt-3 space-y-3">
                  {kit.claimsAllowed.map((v, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        value={v}
                        onChange={(e) => updateListItem("claimsAllowed", idx, e.target.value)}
                        placeholder="e.g. 60-day refund guaranteed"
                        className="flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/35 outline-none focus:border-purple-400/40 focus:ring-2 focus:ring-purple-500/20 transition"
                      />
                      <button
                        type="button"
                        onClick={() => removeListItem("claimsAllowed", idx)}
                        className="px-3 rounded-xl border border-white/10 bg-white/5 text-white/75 hover:bg-white/10 transition"
                        title="Remove"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => addListItem("claimsAllowed")}
                  className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-white/90 hover:bg-white/10 transition"
                >
                  <FiPlus />
                  Add claim
                </button>
              </div>
            </section>
          </div>

          {/* Right */}
          <div className="space-y-5">
            {/* Visual */}
            <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
              <h2 className="text-white font-semibold text-lg">Visual Identity</h2>
              <p className="mt-1 text-sm text-white/60">
                Used for creative generation + style direction.
              </p>

              <div className="mt-4">
                <label className="text-xs text-white/55 uppercase tracking-wider">
                  Color palette (2–5)
                </label>

                <div className="mt-3 space-y-3">
                  {(kit.colors || []).slice(0, 5).map((c, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <input
                        type="color"
                        value={c || "#000000"}
                        onChange={(e) => {
                          const next = [...kit.colors];
                          next[idx] = e.target.value;
                          setField("colors", next);
                        }}
                        className="h-10 w-12 rounded-xl border border-white/10 bg-transparent"
                      />
                      <input
                        value={c}
                        onChange={(e) => {
                          const next = [...kit.colors];
                          next[idx] = e.target.value;
                          setField("colors", next);
                        }}
                        placeholder="#A855F7"
                        className="flex-1 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white placeholder:text-white/35 outline-none focus:border-purple-400/40 focus:ring-2 focus:ring-purple-500/20 transition"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const next = [...kit.colors].filter((_, i) => i !== idx);
                          setField("colors", next.length ? next : [""]);
                        }}
                        className="px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-white/75 hover:bg-white/10 transition"
                        title="Remove"
                      >
                        <FiX />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setField("colors", [...(kit.colors || []), "#111827"].slice(0, 5))
                    }
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-white/90 hover:bg-white/10 transition"
                  >
                    <FiPlus />
                    Add color
                  </button>
                  <button
                    type="button"
                    onClick={copyPalette}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-white/90 hover:bg-white/10 transition"
                    title="Copy palette"
                  >
                    <FiCopy />
                  </button>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  {clampPalette(kit.colors).map((c) => (
                    <div
                      key={c}
                      className="h-7 w-7 rounded-xl border border-white/10"
                      style={{ background: c }}
                      title={c}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <label className="text-xs text-white/55 uppercase tracking-wider">
                  Style notes
                </label>
                <textarea
                  value={kit.styleNotes}
                  onChange={(e) => setField("styleNotes", e.target.value)}
                  rows={4}
                  placeholder="e.g. futuristic minimal, glass cards, purple neon accents"
                  className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/35 outline-none focus:border-purple-400/40 focus:ring-2 focus:ring-purple-500/20 transition"
                />
              </div>
            </section>

            {/* Rules */}
            <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
              <h2 className="text-white font-semibold text-lg">Copy Rules</h2>

              <div className="mt-4">
                <label className="text-xs text-white/55 uppercase tracking-wider">
                  Words to use
                </label>
                <textarea
                  value={kit.wordsToUse}
                  onChange={(e) => setField("wordsToUse", e.target.value)}
                  rows={3}
                  placeholder="Words/phrases Nova should lean into"
                  className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/35 outline-none focus:border-purple-400/40 focus:ring-2 focus:ring-purple-500/20 transition"
                />
              </div>

              <div className="mt-4">
                <label className="text-xs text-white/55 uppercase tracking-wider">
                  Words to avoid
                </label>
                <textarea
                  value={kit.wordsToAvoid}
                  onChange={(e) => setField("wordsToAvoid", e.target.value)}
                  rows={3}
                  placeholder="Anything that feels off-brand or scammy"
                  className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/35 outline-none focus:border-purple-400/40 focus:ring-2 focus:ring-purple-500/20 transition"
                />
              </div>
            </section>

            {/* Distribution */}
            <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
              <h2 className="text-white font-semibold text-lg">Distribution</h2>
              <p className="mt-1 text-sm text-white/60">
                Helps Nova tailor format + structure.
              </p>

              <div className="mt-4">
                <label className="text-xs text-white/55 uppercase tracking-wider">
                  Platforms
                </label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {PLATFORM_OPTIONS.map((p) => {
                    const active = kit.platforms.includes(p);
                    return (
                      <button
                        key={p}
                        onClick={() => togglePlatform(p)}
                        type="button"
                        className={[
                          "px-3 py-2 rounded-xl text-sm border transition",
                          active
                            ? "border-purple-400/30 bg-purple-500/10 text-white"
                            : "border-white/10 bg-white/5 text-white/75 hover:bg-white/10",
                        ].join(" ")}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-5">
                <label className="text-xs text-white/55 uppercase tracking-wider">
                  Competitors (optional)
                </label>
                <div className="mt-3 space-y-3">
                  {kit.competitors.map((v, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        value={v}
                        onChange={(e) => updateListItem("competitors", idx, e.target.value)}
                        placeholder="Brand name / IG handle / website"
                        className="flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/35 outline-none focus:border-purple-400/40 focus:ring-2 focus:ring-purple-500/20 transition"
                      />
                      <button
                        type="button"
                        onClick={() => removeListItem("competitors", idx)}
                        className="px-3 rounded-xl border border-white/10 bg-white/5 text-white/75 hover:bg-white/10 transition"
                        title="Remove"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => addListItem("competitors")}
                  className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-white/90 hover:bg-white/10 transition"
                >
                  <FiPlus />
                  Add competitor
                </button>
              </div>
            </section>

            {/* Quick actions */}
            <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-purple-500/10 to-white/5 backdrop-blur-xl p-6">
              <div className="text-white font-semibold">Next</div>
              <div className="mt-1 text-sm text-white/65">
                Save this, then generate ads/copy with your Brand Kit context.
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <button
                  onClick={() => navigate("/dashboard/ads")}
                  className="px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white font-semibold shadow-[0_0_26px_rgba(168,85,247,0.22)] hover:opacity-95 transition inline-flex items-center justify-center gap-2"
                >
                  <FiZap />
                  Go to Ads Center
                </button>

                <button
                  onClick={() => navigate("/dashboard")}
                  className="px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white/90 hover:bg-white/10 transition inline-flex items-center justify-center gap-2"
                >
                  <FiCheckCircle />
                  Back to Overview
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Save */}
        <div className="md:hidden mt-6">
          <button
            onClick={save}
            disabled={saving}
            className={[
              "w-full px-4 py-3 rounded-xl font-semibold transition inline-flex items-center justify-center gap-2",
              saving
                ? "bg-white/10 text-white/40 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white shadow-[0_0_26px_rgba(168,85,247,0.22)] hover:opacity-95",
            ].join(" ")}
          >
            <FiSave />
            {saving ? "Saving..." : "Save Brand Kit"}
          </button>
        </div>
      </div>
    </div>
  );
}
