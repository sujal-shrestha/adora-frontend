// src/components/layout/MainLayout.jsx
import Sidebar from "./Sidebar";
import HeaderBar from "./HeadBar";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#05060a] text-white">
      {/* Background layers */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(168,85,247,0.25),transparent_35%),radial-gradient(circle_at_75%_25%,rgba(59,130,246,0.14),transparent_38%),radial-gradient(circle_at_60%_80%,rgba(236,72,153,0.10),transparent_40%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#05060a] via-[#070816] to-[#05060a]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:48px_48px]" />
      </div>

      <div className="flex">
        <Sidebar />
        <div className="flex-1 min-h-screen">
          <HeaderBar />
          {/* Dashboard content area */}
          <div className="p-6 min-h-[calc(100vh-72px)]">{children}</div>
        </div>
      </div>
    </div>
  );
}
