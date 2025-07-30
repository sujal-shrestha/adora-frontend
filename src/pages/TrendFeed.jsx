import React, { useState } from 'react';
import axios from 'axios';
import { FiSearch } from 'react-icons/fi';

const TrendFeed = () => {
  const [niche, setNiche] = useState('');
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!niche.trim()) return;
    setLoading(true);
    setError('');
    setTrends([]);

    try {
      const res = await axios.post('/api/trends', { niche });
      setTrends(res.data.trends || []);
    } catch (err) {
      console.error('Error fetching trends:', err);
      setError('Failed to fetch trends. Try another niche.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-12">
      <h1 className="text-4xl font-semibold mb-8 text-center text-gray-800">
        Discover Trends & Marketing Ideas
      </h1>

      <div className="w-full max-w-2xl flex items-center shadow-md bg-white rounded-full overflow-hidden px-4 py-2">
        <FiSearch className="text-gray-400 text-xl mr-2" />
        <input
          type="text"
          placeholder="Search a niche (e.g. fashion, crypto, fitness)"
          className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
          value={niche}
          onChange={(e) => setNiche(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>

      {loading && <p className="text-gray-500 mt-6">🔄 Loading trends...</p>}
      {error && <p className="text-red-500 mt-6">{error}</p>}

      <div className="w-full max-w-3xl mt-10 space-y-6">
        {trends.map((trend, index) => (
          <div
            key={index}
            className="bg-white shadow-sm hover:shadow-md transition border border-gray-100 rounded-lg p-5"
          >
            <a
              href={trend.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl font-semibold text-blue-700 hover:underline"
            >
              {trend.title}
            </a>
            <p className="text-gray-700 mt-2">{trend.description}</p>
            {trend.source && (
              <p className="text-sm text-gray-400 mt-1">Source: {trend.source}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendFeed;
