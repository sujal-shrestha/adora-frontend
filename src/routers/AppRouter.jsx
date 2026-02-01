import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "../pages/Homepage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import HomeOverview from "../pages/HomeOverview";
import AdsCenter from "../pages/AdsCenter";
import Campaigns from "../pages/Campaigns";
import MyMedia from "../pages/MyMedia";
import TrendFeed from "../pages/TrendFeed";
import Settings from "../pages/Settings";

// ✅ NEW imports
import BrandKit from "../pages/BrandKit";
import AIStudio from "../pages/AIStudio";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<HomeOverview />} />
          <Route path="ai" element={<AIStudio />} />             {/* ✅ NEW */}
          <Route path="brand-kit" element={<BrandKit />} />      {/* ✅ NEW */}

          <Route path="ads" element={<AdsCenter />} />
          <Route path="campaigns" element={<Campaigns />} />
          <Route path="media" element={<MyMedia />} />
          <Route path="trends" element={<TrendFeed />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
