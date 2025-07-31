import React, { useState, useEffect } from "react";
import api from "../api"; // ✅ Using centralized Axios instance
import { Dialog } from "@headlessui/react";
import { X, Plus } from "lucide-react";

const AdsCenter = () => {
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState(null);
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showKhaltiModal, setShowKhaltiModal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [userMedia, setUserMedia] = useState([]);
  const [showMediaOptions, setShowMediaOptions] = useState(false);
  const [showMyMediaPicker, setShowMyMediaPicker] = useState(false);

  useEffect(() => {
    if (!window.KhaltiCheckout) {
      const script = document.createElement("script");
      script.src = "https://khalti.com/static/khalti-checkout.js";
      script.async = true;
      script.onload = () => console.log("✅ Khalti script loaded.");
      document.body.appendChild(script);
    }

    const fetchData = async () => {
      try {
        const profileRes = await api.get("/auth/me");
        const user = profileRes.data.user || profileRes.data;
        setCredits(user.credits || 20);

        const mediaRes = await api.get("/media/me/media");
        setUserMedia(Array.isArray(mediaRes.data) ? mediaRes.data : []);
      } catch (err) {
        console.error("❌ Fetch error:", err);
      }
    };

    fetchData();
  }, []);

  const handleGenerateAd = async () => {
    if (!prompt) return alert("Please enter a prompt!");
    if (credits < 5) return alert("Not enough credits!");

    try {
      setLoading(true);

      const res = await api.post("/ads/generate", {
        prompt,
        image: selectedMedia,
      });

      setGeneratedImage(res.data.image);
      setCredits(res.data.remainingCredits);
      setPrompt("");
      setSelectedMedia(null);
      setUserMedia((prev) => [res.data.image, ...prev]);
    } catch (error) {
      alert(error.response?.data?.message || "Error generating ad");
    } finally {
      setLoading(false);
    }
  };

  const handleKhaltiPayment = () => {
    const khaltiCheckout = new window.KhaltiCheckout({
      publicKey: "test_public_key_dc74b7d5be8942ca9b09c19906aeb644",
      productIdentity: "adora-credits",
      productName: "Adora Credits",
      productUrl: "http://localhost:5173",
      eventHandler: {
        onSuccess: async (payload) => {
          try {
            const res = await api.post("/payment/verify", { pidx: payload.pidx });
            if (res.data.success) {
              setCredits((prev) => prev + res.data.creditsAdded);
              setShowKhaltiModal(false);
              alert("✅ Payment successful. Credits added.");
            } else {
              alert("❌ Payment verification failed.");
            }
          } catch (err) {
            console.error("❌ Verification error", err);
            alert("❌ Failed to verify payment.");
          }
        },
        onError: (error) => {
          console.error("❌ Payment Error", error);
          alert("Payment failed");
        },
      },
    });

    khaltiCheckout.show({ amount: 5000 });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 rounded-xl bg-white shadow-md">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">🎨 Ads Center</h1>
        <span className="bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full text-sm">
          Credits: {credits}
        </span>
      </div>

      <textarea
        rows={3}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your ad idea (e.g. Flash Sale on Jackets)"
        className="w-full border border-gray-300 rounded-lg p-3 mb-4"
      />

      <div className="mb-6">
        <label className="block font-semibold mb-2">Attach an Image</label>
        <button
          onClick={() => setShowMediaOptions(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
        >
          <Plus size={18} />
          <span className="text-sm font-medium">Add Image</span>
        </button>

        {selectedMedia && (
          <div className="mt-3">
            <img
              src={selectedMedia}
              alt="Selected"
              className="w-20 h-20 rounded border object-cover"
            />
          </div>
        )}
      </div>

      <button
        onClick={handleGenerateAd}
        disabled={loading || credits < 5}
        className={`w-full py-2 rounded-lg text-white font-medium ${
          loading || credits < 5
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        {loading ? "Generating..." : "Generate Ad (5 credits)"}
      </button>

      {generatedImage && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">🖼️ Generated Ad</h3>
          <img
            src={generatedImage}
            alt="Generated"
            className="w-full rounded-xl border"
          />
          <div className="mt-3 text-right">
            <a
              href={generatedImage}
              download="generated-ad.png"
              className="text-blue-600 text-sm underline"
            >
              ⬇️ Download Ad
            </a>
          </div>
        </div>
      )}

      <div className="mt-8 text-center">
        <button
          onClick={() => setShowKhaltiModal(true)}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          💳 Buy More Credits
        </button>
      </div>

      {/* Dialogs */}
      <Dialog open={showMediaOptions} onClose={() => setShowMediaOptions(false)}>
        <div className="fixed inset-0 bg-black/40" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-black"
              onClick={() => setShowMediaOptions(false)}
            >
              <X />
            </button>
            <h2 className="text-lg font-semibold mb-4">Choose an Option</h2>
            <div className="flex flex-col gap-4">
              <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded text-center">
                📁 Choose from File
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setSelectedMedia(reader.result);
                        setShowMediaOptions(false);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
              <button
                onClick={() => {
                  setShowMediaOptions(false);
                  setShowMyMediaPicker(true);
                }}
                className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded text-center"
              >
                🖼️ Choose from My Media
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      <Dialog open={showMyMediaPicker} onClose={() => setShowMyMediaPicker(false)}>
        <div className="fixed inset-0 bg-black/40" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-black"
              onClick={() => setShowMyMediaPicker(false)}
            >
              <X />
            </button>
            <h2 className="text-lg font-semibold mb-4">My Media</h2>
            {userMedia.length === 0 ? (
              <p className="text-sm text-gray-500 text-center">No media found.</p>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {userMedia.map((media) => (
                  <img
                    key={media._id || media}
                    src={media.url || media}
                    onClick={() => {
                      setSelectedMedia(media.url || media);
                      setShowMyMediaPicker(false);
                    }}
                    className={`w-full h-20 object-cover rounded cursor-pointer ${
                      selectedMedia === (media.url || media)
                        ? "ring-2 ring-indigo-500"
                        : ""
                    }`}
                  />
                ))}
              </div>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>

      <Dialog open={showKhaltiModal} onClose={() => setShowKhaltiModal(false)}>
        <div className="fixed inset-0 bg-black/40" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full relative">
            <button
              className="absolute right-4 top-4 text-gray-400 hover:text-black"
              onClick={() => setShowKhaltiModal(false)}
            >
              <X />
            </button>
            <h2 className="text-xl font-semibold mb-2 text-center">
              Buy Credits via Khalti
            </h2>
            <p className="text-center text-gray-500 mb-4">
              1 Credit = NPR 10
              <br />
              Get 5 Credits for NPR 50
            </p>
            <button
              onClick={handleKhaltiPayment}
              className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 w-full"
            >
              Pay NPR 50 Now
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default AdsCenter;
