import { NavLink } from "react-router-dom";
import novaLogo from "../../assets/nova_logo.png";

const navItems = [
  { label: "Overview", to: "/dashboard" },
  { label: "Spy", to: "/dashboard/spy" },
  { label: "Ads Center", to: "/dashboard/ads" },
  { label: "Campaigns", to: "/dashboard/campaigns" },
  { label: "My Media", to: "/dashboard/media" },
  { label: "Trends", to: "/dashboard/trends" },
  { label: "Settings", to: "/dashboard/settings" },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex w-72 shrink-0">
      <div className="fixed h-screen w-72 p-5">
        <div className="h-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_40px_rgba(168,85,247,0.12)]">
          {/* Brand */}
          <div className="px-5 pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_24px_rgba(168,85,247,0.20)] flex items-center justify-center overflow-hidden">
                <img
                  src={novaLogo}
                  alt="Nova logo"
                  className="h-7 w-7 object-contain"
                />
              </div>

              <div>
                <div className="text-white font-bold text-lg leading-tight">
                  Nova
                </div>
                <div className="text-white/60 text-xs">
                  AI Marketing Assistant
                </div>
              </div>
            </div>
          </div>

          <div className="px-3 pb-5">
            <div className="mb-3 px-3 text-white/50 text-xs uppercase tracking-wider">
              Workspace
            </div>

            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/dashboard"}
                  className={({ isActive }) =>
                    [
                      "px-3 py-2.5 rounded-xl text-sm font-medium transition flex items-center justify-between",
                      isActive
                        ? "bg-gradient-to-r from-purple-500/25 to-fuchsia-500/15 text-white border border-white/10 shadow-[0_0_22px_rgba(168,85,247,0.18)]"
                        : "text-white/80 hover:text-white hover:bg-white/5",
                    ].join(" ")
                  }
                >
                  <span>{item.label}</span>
                  <span className="text-white/30 text-xs">↗</span>
                </NavLink>
              ))}
            </nav>

            {/* Bottom hint */}
            <div className="mt-6 mx-2 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-4">
              <div className="text-white font-semibold text-sm">Pro tip</div>
              <div className="text-white/60 text-xs mt-1">
                Save your best creatives in{" "}
                <span className="text-white/80">My Media</span> and reuse them in
                Ads Center.
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
