import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiTarget,
  FiBarChart2,
  FiFileText,
  FiImage,
  FiTrendingUp,
  FiSettings,
  FiSun,
  FiMoon,
} from 'react-icons/fi';

const tiles = [
  { title: 'SPY', icon: <FiTarget />, route: '/dashboard/spy' },
  { title: 'Ads Center', icon: <FiBarChart2 />, route: '/dashboard/ads' },
  { title: 'Campaigns', icon: <FiFileText />, route: '/dashboard/campaigns' },
  { title: 'My Media', icon: <FiImage />, route: '/dashboard/media' },
  { title: 'Trends', icon: <FiTrendingUp />, route: '/dashboard/trends' },
  { title: 'Settings', icon: <FiSettings />, route: '/dashboard/settings' },
];

export default function HomeOverview() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [time, setTime] = useState(new Date());
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('adora_user')) || {};
    setUser(userData);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'} min-h-screen px-6 py-12 transition`}>
      {/* Dark Mode Toggle */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="flex items-center gap-2 text-sm px-3 py-1 border rounded-full backdrop-blur-md bg-white/20 dark:bg-white/10 hover:scale-105 transition"
        >
          {darkMode ? <FiSun /> : <FiMoon />}
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col items-center text-center mb-10">
        <h1 className="text-4xl font-bold">
          {getGreeting()}, {user.name?.split(' ')[0] || 'there'} 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-300 mt-2">
          Welcome to Adora. Here’s your dashboard.
        </p>

        {/* Time Widget */}
        <div className="mt-6 bg-white/30 dark:bg-white/10 backdrop-blur-md px-6 py-3 rounded-xl shadow-md border border-white/20 text-lg font-medium">
          {time.toLocaleTimeString()} · {time.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
        </div>
      </div>

      {/* Feature Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {tiles.map((tile, index) => (
          <div
            key={index}
            onClick={() => navigate(tile.route)}
            className={`cursor-pointer flex flex-col items-center justify-center p-6 rounded-2xl shadow-md transition-all hover:scale-[1.02]
              ${darkMode
                ? 'bg-white/10 border border-white/20 text-white'
                : 'bg-white/30 border border-white/20 text-gray-800 backdrop-blur-md'
              }`}
          >
            <div className="text-3xl mb-3">{tile.icon}</div>
            <div className="text-lg font-medium">{tile.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
