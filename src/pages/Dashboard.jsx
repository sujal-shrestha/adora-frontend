import { useState } from 'react';
import { FaHome, FaBullseye, FaChartBar, FaFileAlt, FaLightbulb, FaVideo } from 'react-icons/fa';

export default function Dashboard() {
  const [active, setActive] = useState('Home');

  const navItems = [
    { label: 'Home', icon: <FaHome /> },
    { label: 'SPY', icon: <FaBullseye /> },
    { label: 'Ads Center', icon: <FaChartBar /> },
    { label: 'Campaigns', icon: <FaFileAlt /> },
    { label: 'Content', icon: <FaVideo /> },
    { label: 'Trends', icon: <FaLightbulb /> },
  ];

  return (
    <div className="flex min-h-screen text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white flex flex-col py-6 px-4">
        <h1 className="text-2xl font-bold mb-10">Adora</h1>
        <nav className="flex flex-col gap-4">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActive(item.label)}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition ${
                active === item.label ? 'bg-white text-blue-700 font-semibold' : 'hover:bg-blue-700'
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-gray-100">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">{active}</h2>
          <div className="flex gap-4 items-center">
            <button className="bg-blue-100 text-blue-700 px-4 py-1 rounded-md text-sm font-medium">Invite Team</button>
            <img
              src="https://i.pravatar.cc/40"
              alt="avatar"
              className="rounded-full w-8 h-8 border"
            />
          </div>
        </div>

        {/* Dynamic Area */}
        {active === 'Home' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded shadow">
              <h3 className="font-bold mb-2">Create</h3>
              <div className="flex gap-2 flex-wrap">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-full">Brand Video</button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-full">Content</button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-full">Campaign</button>
              </div>
            </div>

            <div className="bg-white p-6 rounded shadow">
              <h3 className="font-bold mb-2">Ads Center</h3>
              <ul className="space-y-1 text-blue-600">
                <li>Ad Analytics</li>
                <li>Competitors</li>
                <li>Live Ads</li>
                <li>Trends</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded shadow">
              <h3 className="font-bold mb-2">SPY Competitor Analysis</h3>
              <ul className="space-y-1">
                <li>Growthhub</li>
                <li>Innovate</li>
                <li>VividCraft</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded shadow col-span-1 md:col-span-2 xl:col-span-1">
              <h3 className="font-bold mb-2">Campaign Calendar</h3>
              <p className="text-sm text-gray-500">Coming soon...</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
