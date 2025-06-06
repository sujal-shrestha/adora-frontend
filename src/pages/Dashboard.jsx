import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaBullseye,
  FaChartBar,
  FaFileAlt,
  FaLightbulb,
  FaVideo,
  FaCog,
} from 'react-icons/fa';

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Home', path: '/dashboard', icon: <FaHome /> },
    { label: 'SPY', path: '/dashboard/spy', icon: <FaBullseye /> },
    { label: 'Ads Center', path: '/dashboard/ads', icon: <FaChartBar /> },
    { label: 'Campaigns', path: '/dashboard/campaigns', icon: <FaFileAlt /> },
    { label: 'Content', path: '/dashboard/content', icon: <FaVideo /> },
    { label: 'Trends', path: '/dashboard/trends', icon: <FaLightbulb /> },
    { label: 'Settings', path: '/dashboard/settings', icon: <FaCog /> },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-800 text-white p-6">
        <h1 className="text-2xl font-bold mb-8">Adora</h1>
        <nav className="flex flex-col gap-3">
          {navItems.map(({ label, path, icon }) => {
            const isActive = location.pathname === path;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition 
                  ${isActive
                    ? 'bg-white bg-opacity-20 backdrop-blur-md text-white font-semibold'
                    : 'hover:bg-blue-700'
                  }`}
              >
                {icon}
                {label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main area */}
      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
}