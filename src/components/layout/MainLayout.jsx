import Sidebar from "./Sidebar";
import HeaderBar from "./HeaderBar";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen w-full bg-[#05060a]">
      {/* Background glow layers */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(168,85,247,0.22),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(59,130,246,0.12),transparent_40%),radial-gradient(circle_at_60%_80%,rgba(236,72,153,0.10),transparent_45%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#05060a] via-[#070816] to-[#05060a]" />
      </div>

      <div className="flex min-h-screen w-full">
        <Sidebar />

        <div className="flex-1 min-w-0">
          <HeaderBar />
          <main className="p-6 md:p-8">
            <div className="mx-auto w-full max-w-6xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
