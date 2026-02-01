// src/pages/AdsCenter.jsx
import React, { useEffect, useMemo, useState } from "react";
import api from "../api";
import { Dialog } from "@headlessui/react";
import {
  FiZap,
  FiImage,
  FiDownload,
  FiPlus,
  FiCreditCard,
  FiChevronDown,
  FiChevronUp,
  FiInfo,
} from "react-icons/fi";

const COST_PER_GEN = 5;
const COST_REGEN = 3;

export default function AdsCenter() {
  const [prompt, setPrompt] = useState("");
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(false);

  const [lastGenerated, setLastGenerated] = useState(null); // { image, filename, saved }
  const [savingToMedia, setSavingToMedia] = useState(false);

  // ✅ Stripe
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [selectedPackId, setSelectedPackId] = useState("pro"); // ✅ IMPORTANT

  // Reference image (UI-only for now)
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [userMedia, setUserMedia] = useState([]);
  const [showMediaOptions, setShowMediaOptions] = useState(false);
  const [showMyMediaPicker, setShowMyMediaPicker] = useState(false);

  // BrandKit injection
  const [brandKit, setBrandKit] = useState(null);
  const [brandKitError, setBrandKitError] = useState("");

  // UX toggle
  const [showPromptDetails, setShowPromptDetails] = useState(false);

  const resolveAssetUrl = (u) => {
    if (!u) return "";
    if (typeof u !== "string") return "";
    if (u.startsWith("data:")) return u;
    if (/^https?:\/\//i.test(u)) return u;

    const base = api?.defaults?.baseURL || "";
    const origin = base.replace(/\/api\/?$/, "");
    return `${origin}${u}`;
  };

  const fetchMedia = async () => {
    const mediaRes = await api.get("/media/me/media");
    const raw = Array.isArray(mediaRes.data) ? mediaRes.data : [];

    const normalized = raw
      .map((m) => {
        if (!m) return null;
        if (typeof m === "string") return { url: m };
        if (typeof m === "object" && m.url) return m;
        return null;
      })
      .filter(Boolean);

    setUserMedia(normalized);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setBrandKitError("");

        const profileRes = await api.get("/auth/me");
        const user = profileRes.data.user || profileRes.data;
        setCredits(user.credits ?? 20);

        await fetchMedia();

        try {
          const bkRes = await api.get("/brandkit/me");
          setBrandKit(bkRes.data?.brandKit || null);
        } catch (e) {
          console.error("❌ BrandKit fetch error:", e);
          setBrandKit(null);
          setBrandKitError("Brand Kit not found. Creative will generate without brand context.");
        }
      } catch (err) {
        console.error("❌ Fetch error:", err);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const normalizeColors = (colors) =>
    (colors || [])
      .map((c) => (c || "").trim())
      .filter(Boolean)
      .slice(0, 5);

  const buildInjectedPrompt = (userPrompt) => {
    const trimmedUser = (userPrompt || "").trim();
    if (!trimmedUser) return "";

    const niche = brandKit?.niche?.trim();
    const styleNotes = brandKit?.styleNotes?.trim();
    const colors = normalizeColors(brandKit?.colors);

    const hasAnyContext = Boolean(niche || styleNotes || colors.length);
    if (!hasAnyContext) return trimmedUser;

    const colorLine = colors.length ? colors.join(", ") : "N/A";
    const nicheLine = niche || "N/A";
    const styleLine = styleNotes || "N/A";

    return [
      "Nova BrandKit (Creative Direction)",
      `Niche: ${nicheLine}`,
      `Brand colors: ${colorLine}`,
      `Style notes: ${styleLine}`,
      "",
      "User prompt:",
      trimmedUser,
    ].join("\n");
  };

  const finalPromptPreview = useMemo(() => buildInjectedPrompt(prompt), [prompt, brandKit]);

  const canGenerate = useMemo(
    () => Boolean(prompt.trim()) && credits >= COST_PER_GEN && !loading,
    [prompt, credits, loading]
  );

  const canRegenerate = useMemo(
    () => Boolean(prompt.trim()) && credits >= COST_REGEN && !loading,
    [prompt, credits, loading]
  );

  const handleGenerateAd = async () => {
    const trimmed = prompt.trim();
    if (!trimmed) return alert("Please enter a prompt!");
    if (credits < COST_PER_GEN) return alert("Not enough credits!");

    try {
      setLoading(true);

      const finalPrompt = buildInjectedPrompt(trimmed);
      const res = await api.post("/ads/generate", { prompt: finalPrompt });

      setCredits(res.data.remainingCredits);

      setLastGenerated({
        image: res.data.image,
        filename: res.data.filename,
        saved: false,
      });

      setSelectedMedia(null);
      setShowPromptDetails(false);
    } catch (error) {
      alert(error.response?.data?.message || "Error generating ad");
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    const trimmed = prompt.trim();
    if (!trimmed) return alert("Please enter a prompt!");
    if (credits < COST_REGEN) return alert("Not enough credits to regenerate!");

    try {
      setLoading(true);

      const finalPrompt = buildInjectedPrompt(trimmed);
      const res = await api.post("/ads/regenerate", { prompt: finalPrompt });

      setCredits(res.data.remainingCredits);

      setLastGenerated({
        image: res.data.image,
        filename: res.data.filename,
        saved: false,
      });
    } catch (error) {
      alert(error.response?.data?.message || "Error regenerating ad");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToMedia = async () => {
    if (!lastGenerated?.image) return;

    try {
      setSavingToMedia(true);

      await api.post("/ads/save", {
        image: lastGenerated.image,
        filename: lastGenerated.filename,
      });

      setLastGenerated((prev) => (prev ? { ...prev, saved: true } : prev));
      await fetchMedia();
      alert("✅ Saved to My Media");
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to save to My Media");
    } finally {
      setSavingToMedia(false);
    }
  };

  // ✅ MUST match backend route: /api/payment/stripe/create-checkout-session
  const handleStripeCheckout = async () => {
    try {
      const res = await api.post("/payment/stripe/create-checkout-session", {
        packId: selectedPackId, // ✅ IMPORTANT
      });

      const url = res.data?.url;
      if (!url) {
        alert("Stripe checkout URL not received from server.");
        return;
      }

      window.location.href = url;
    } catch (err) {
      console.error("Stripe checkout error:", err);
      alert(err?.response?.data?.message || "Failed to start Stripe checkout.");
    }
  };

  const outputImage = lastGenerated?.image || null;
  const outputImageResolved = resolveAssetUrl(outputImage);

  return (
    <div className="min-h-[calc(100vh-72px)]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.7)]" />
              Ads Center v2
            </div>

            <h1 className="mt-4 text-2xl md:text-3xl font-semibold tracking-tight text-white">
              Generate on-brand creatives
            </h1>
            <p className="mt-2 text-white/65 text-sm md:text-base max-w-2xl">
              Nova auto-injects your Brand Kit (colors + style notes + niche) so every output matches your vibe.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span
              className={[
                "inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-sm",
                brandKit
                  ? "border-purple-400/20 bg-purple-500/10 text-white"
                  : "border-white/10 bg-white/5 text-white/70",
              ].join(" ")}
            >
              <FiInfo />
              {brandKit ? "BrandKit: ON" : "BrandKit: OFF"}
            </span>

            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-white/85 text-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.55)]" />
              Credits: <span className="font-semibold">{credits}</span>
            </span>

            <button
              onClick={() => setShowStripeModal(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white font-semibold shadow-[0_0_26px_rgba(168,85,247,0.22)] hover:opacity-95 transition inline-flex items-center gap-2"
            >
              <FiCreditCard />
              Buy Credits
            </button>
          </div>
        </div>

        {brandKitError ? (
          <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            {brandKitError}
          </div>
        ) : null}

        <div className="mt-8 grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-[0_0_60px_rgba(168,85,247,0.08)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-white font-semibold text-lg">Create a new ad</div>
                <div className="mt-1 text-sm text-white/65">
                  Describe your offer + target audience. We’ll generate a creative.
                </div>
              </div>
              <div className="text-white/70 text-sm inline-flex items-center gap-2">
                <FiZap />
                {COST_PER_GEN} credits / generate
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-xs text-white/55 uppercase tracking-wider">
                Prompt (what are we promoting?)
              </div>

              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={5}
                placeholder="Example: Flash sale on jackets — 40% off for 48 hours. Target: streetwear guys, winter fits, limited stock."
                className="mt-3 w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/35 outline-none focus:border-purple-400/40 focus:ring-2 focus:ring-purple-500/20 transition"
              />

              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => setShowPromptDetails((s) => !s)}
                  className="text-sm text-white/70 hover:text-white transition inline-flex items-center gap-2"
                >
                  {showPromptDetails ? <FiChevronUp /> : <FiChevronDown />}
                  {showPromptDetails
                    ? "Hide prompt details"
                    : "Show prompt details (BrandKit injection)"}
                </button>

                {showPromptDetails && (
                  <div className="mt-3 rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div className="text-xs text-white/55 uppercase tracking-wider">
                      Final prompt sent to generator
                    </div>
                    <div className="mt-2 text-xs whitespace-pre-wrap text-white/75">
                      {finalPromptPreview || "Start typing above…"}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleGenerateAd}
                  disabled={!canGenerate}
                  className={[
                    "px-5 py-3 rounded-xl font-semibold transition inline-flex items-center justify-center gap-2",
                    canGenerate
                      ? "bg-gradient-to-r from-purple-500 to-fuchsia-500 shadow-[0_0_26px_rgba(168,85,247,0.22)] hover:opacity-95 text-white"
                      : "bg-white/10 text-white/40 cursor-not-allowed",
                  ].join(" ")}
                >
                  <FiZap />
                  {loading ? "Generating..." : `Generate Ad (${COST_PER_GEN} credits)`}
                </button>

                <button
                  onClick={() => setShowMediaOptions(true)}
                  className="px-5 py-3 rounded-xl border border-white/10 bg-white/5 text-white/90 hover:bg-white/10 transition inline-flex items-center justify-center gap-2"
                >
                  <FiImage />
                  Attach Reference Image
                </button>
              </div>

              {selectedMedia ? (
                <div className="mt-4 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
                  <img
                    src={resolveAssetUrl(selectedMedia)}
                    alt="Selected"
                    className="h-10 w-10 rounded-xl object-cover border border-white/10"
                  />
                  <div className="text-sm text-white/75">Reference image attached</div>
                  <button
                    onClick={() => setSelectedMedia(null)}
                    className="ml-auto text-xs text-white/60 hover:text-white transition"
                  >
                    Remove
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-[0_0_60px_rgba(168,85,247,0.08)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-white font-semibold text-lg">Output</div>
                <div className="mt-1 text-sm text-white/65">Generated creative appears here.</div>
              </div>
              {outputImage ? (
                <span className="text-xs text-white/70 rounded-full border border-white/10 bg-black/20 px-3 py-1">
                  Latest
                </span>
              ) : null}
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-3">
              {outputImage ? (
                <img
                  src={outputImageResolved}
                  alt="Generated"
                  className="w-full rounded-xl border border-white/10 object-cover"
                  onError={() => console.warn("Preview image failed:", outputImageResolved)}
                />
              ) : (
                <div className="py-14 text-center">
                  <div className="mx-auto h-12 w-12 rounded-2xl border border-white/10 bg-white/5 grid place-items-center text-white/70">
                    <FiImage />
                  </div>
                  <div className="mt-4 text-sm text-white/70">No output yet</div>
                  <div className="mt-1 text-xs text-white/50">Generate an ad to see it here.</div>
                </div>
              )}
            </div>

            <div className="mt-4 space-y-3">
              <button
                onClick={handleSaveToMedia}
                disabled={!outputImage || lastGenerated?.saved || savingToMedia}
                className={[
                  "w-full px-4 py-3 rounded-xl font-semibold transition inline-flex items-center justify-center gap-2 border",
                  outputImage && !lastGenerated?.saved && !savingToMedia
                    ? "bg-white/10 hover:bg-white/15 text-white border-white/10"
                    : "bg-white/5 text-white/30 border-white/10 cursor-not-allowed",
                ].join(" ")}
              >
                {lastGenerated?.saved
                  ? "Saved to My Media ✅"
                  : savingToMedia
                  ? "Saving..."
                  : "Save to My Media"}
              </button>

              <button
                onClick={handleRegenerate}
                disabled={!canRegenerate}
                className={[
                  "w-full px-4 py-3 rounded-xl font-semibold transition inline-flex items-center justify-center gap-2",
                  canRegenerate
                    ? "bg-gradient-to-r from-purple-500 to-fuchsia-500 shadow-[0_0_26px_rgba(168,85,247,0.22)] hover:opacity-95 text-white"
                    : "bg-white/10 text-white/40 cursor-not-allowed",
                ].join(" ")}
              >
                <FiZap />
                {loading ? "Working..." : `Regenerate (${COST_REGEN} credits)`}
              </button>

              <a
                href={outputImage ? outputImageResolved : "#"}
                download="nova-generated-ad.png"
                className={[
                  "w-full px-4 py-3 rounded-xl font-semibold transition inline-flex items-center justify-center gap-2 border",
                  outputImage
                    ? "bg-white/5 hover:bg-white/10 text-white border-white/10"
                    : "bg-white/5 text-white/30 border-white/10 cursor-not-allowed pointer-events-none",
                ].join(" ")}
              >
                <FiDownload />
                Download
              </a>

              <button
                onClick={() => setShowStripeModal(true)}
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white/90 hover:bg-white/10 transition inline-flex items-center justify-center gap-2"
              >
                <FiCreditCard />
                Top up credits
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODALS */}
      <Dialog open={showMediaOptions} onClose={() => setShowMediaOptions(false)}>
        <div className="fixed inset-0 bg-black/60" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#0B1220]/80 backdrop-blur-xl p-6 text-white">
            <button
              className="absolute right-4 top-4 text-white/60 hover:text-white transition"
              onClick={() => setShowMediaOptions(false)}
              aria-label="Close"
            >
              <span className="text-xl">×</span>
            </button>

            <h2 className="text-lg font-semibold">Attach a reference image</h2>
            <p className="mt-1 text-sm text-white/60">
              Choose a reference image from your device or from My Media.
            </p>

            <div className="mt-5 grid gap-3">
              <label className="cursor-pointer rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition px-4 py-3 text-sm font-semibold inline-flex items-center justify-center gap-2">
                <FiPlus />
                Choose from File
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setSelectedMedia(reader.result);
                      setShowMediaOptions(false);
                    };
                    reader.readAsDataURL(file);
                  }}
                />
              </label>

              <button
                onClick={() => {
                  setShowMediaOptions(false);
                  setShowMyMediaPicker(true);
                }}
                className="rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition px-4 py-3 text-sm font-semibold inline-flex items-center justify-center gap-2"
              >
                <FiImage />
                Choose from My Media
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      <Dialog open={showMyMediaPicker} onClose={() => setShowMyMediaPicker(false)}>
        <div className="fixed inset-0 bg-black/60" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="relative w-full max-w-3xl rounded-3xl border border-white/10 bg-[#0B1220]/80 backdrop-blur-xl p-6 text-white">
            <button
              className="absolute right-4 top-4 text-white/60 hover:text-white transition"
              onClick={() => setShowMyMediaPicker(false)}
              aria-label="Close"
            >
              <span className="text-xl">×</span>
            </button>

            <h2 className="text-lg font-semibold">My Media</h2>
            <p className="mt-1 text-sm text-white/60">Pick an existing asset.</p>

            <div className="mt-5">
              {userMedia.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-center text-sm text-white/60">
                  No media found.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {userMedia.map((media) => {
                    const src = media?.url;
                    const active = selectedMedia === src;
                    return (
                      <button
                        key={media?._id || src}
                        type="button"
                        onClick={() => {
                          setSelectedMedia(src);
                          setShowMyMediaPicker(false);
                        }}
                        className={[
                          "relative rounded-2xl overflow-hidden border transition",
                          active
                            ? "border-purple-400/40"
                            : "border-white/10 hover:border-white/20",
                        ].join(" ")}
                      >
                        <img
                          src={resolveAssetUrl(src)}
                          alt="media"
                          className="h-28 w-full object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* ✅ Stripe modal */}
      <Dialog open={showStripeModal} onClose={() => setShowStripeModal(false)}>
        <div className="fixed inset-0 bg-black/60" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#0B1220]/80 backdrop-blur-xl p-6 text-white">
            <button
              className="absolute right-4 top-4 text-white/60 hover:text-white transition"
              onClick={() => setShowStripeModal(false)}
              aria-label="Close"
            >
              <span className="text-xl">×</span>
            </button>

            <h2 className="text-xl font-semibold text-center">Buy Credits</h2>
            <p className="mt-2 text-center text-sm text-white/60">
              Powered by Stripe
              <br />
              Choose a pack:
            </p>

            <div className="mt-4 grid gap-2">
              {[
                { id: "starter", label: "Starter" },
                { id: "pro", label: "Pro" },
                { id: "mega", label: "Mega" },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPackId(p.id)}
                  className={[
                    "w-full px-4 py-3 rounded-xl border text-sm font-semibold transition",
                    selectedPackId === p.id
                      ? "border-purple-400/40 bg-purple-500/10 text-white"
                      : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10",
                  ].join(" ")}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleStripeCheckout}
              className="mt-5 w-full px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white font-semibold hover:opacity-95 transition inline-flex items-center justify-center gap-2"
            >
              <FiCreditCard />
              Continue to Stripe
            </button>

            <div className="mt-4 text-xs text-white/45 text-center">
              Credits are added after payment via webhook.
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
