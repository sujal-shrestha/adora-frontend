import { Link } from 'react-router-dom';

export default function Homepage() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between p-6 shadow">
        <h1 className="text-2xl font-extrabold text-blue-600">Adora</h1>
        <Link
          to="/login"
          className="text-blue-600 font-semibold border border-blue-600 px-4 py-2 rounded hover:bg-blue-600 hover:text-white transition"
        >
          Login
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center py-24 px-6">
        <h2 className="text-4xl font-bold mb-4">AI-Powered Marketing for Ambitious Brands</h2>
        <p className="text-lg max-w-xl mb-8 text-gray-600">
          Adora helps you create high-converting campaigns, spy on competitors, and ride marketing trends — all powered by AI.
        </p>
        <Link
          to="/register"
          className="bg-blue-600 text-white px-6 py-3 rounded font-semibold hover:bg-blue-700 transition"
        >
          Get Started
        </Link>
      </section>
    </div>
  );
}
