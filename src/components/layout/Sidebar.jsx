import { NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Create Ad', to: '/create' },
  { label: 'Campaigns', to: '/campaigns' },
  { label: 'Trend Feed', to: '/trends' },
  { label: 'Blog', to: '/blog' },
  { label: 'Settings', to: '/settings' }
];

export default function Sidebar() {
  return (
    <div className="w-64 bg-[#0f1f4b] text-white min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6">Adora</h1>
      <nav className="flex flex-col gap-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `text-sm font-medium ${isActive ? 'text-blue-400' : 'text-white'}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
