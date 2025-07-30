import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import adDataByNiche from "../data/adMockData";

const FacebookAdsSpyModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        window.open(
          "https://www.facebook.com/ads/library/?active_status=active&ad_type=political_and_issue_ads&country=NP&is_targeted_country=false&media_type=all&source=nav-header",
          "_blank"
        );
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
          <button
            className="absolute right-4 top-4 text-gray-400 hover:text-black"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>

          <Dialog.Title className="text-xl font-semibold text-center mb-2">
            Spy on Live Facebook Ads
          </Dialog.Title>
          <p className="text-gray-600 text-sm text-center mb-4">
            You’ll be redirected to Meta’s Ads Library to explore active campaigns in Nepal.
          </p>

          <div className="flex justify-center py-4">
            <div className="w-10 h-10 border-4 border-dashed border-indigo-500 rounded-full animate-spin" />
          </div>

          <p className="text-xs text-center text-gray-400">
            Opening Meta Ads Library…
          </p>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

const SpyTool = () => {
  const [open, setOpen] = useState(false);
  const [selectedNiche, setSelectedNiche] = useState("Fitness");
  const niches = Object.keys(adDataByNiche);
  const ads = adDataByNiche[selectedNiche];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🕵️‍♂️ Ads Spy Tool</h1>
      <p className="mb-4 text-gray-600">
        Instantly access Meta’s official ad library and explore live Facebook and Instagram ads.
      </p>

      <button
        onClick={() => setOpen(true)}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
      >
        Open Facebook Ads Library
      </button>

      {/* Niches Toggle */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-2">Browse Top Ads by Niche</h2>
        <div className="flex gap-3 mb-6 overflow-x-auto">
          {niches.map((niche) => (
            <button
              key={niche}
              onClick={() => setSelectedNiche(niche)}
              className={`px-4 py-2 rounded-full border ${
                selectedNiche === niche
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border-gray-300"
              } transition`}
            >
              {niche}
            </button>
          ))}
        </div>

        {/* Ad Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads.map((ad) => (
            <div
              key={ad.id}
              className="bg-white bg-opacity-80 backdrop-blur rounded-xl p-4 shadow-md hover:shadow-lg transition duration-300"
            >
              <img
                src={ad.image}
                alt={ad.title}
                className="w-full h-40 object-cover rounded-md mb-3"
              />
              <h3 className="font-semibold text-md mb-1">{ad.title}</h3>
              <p className="text-sm text-gray-500 mb-2">{ad.description}</p>
              <p className="text-sm text-gray-500 mb-1">Brand: <strong>{ad.brand}</strong></p>
              <a
                href={ad.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 text-sm hover:underline"
              >
                View on Ads Library
              </a>
            </div>
          ))}
        </div>
      </div>

      <FacebookAdsSpyModal isOpen={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default SpyTool;
