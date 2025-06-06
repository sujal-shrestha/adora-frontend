import { Link } from 'react-router-dom';

export default function Homepage() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 scroll-smooth">
      {/* Navigation */}
      <header className="flex justify-between items-center px-8 py-5 shadow-sm sticky top-0 bg-white z-50">
        <h1 className="text-2xl font-bold text-blue-600 cursor-pointer" onClick={scrollToTop}>
          Adora
        </h1>
        <nav className="flex items-center gap-6">
          <button onClick={scrollToTop} className="hover:text-blue-600 transition">
            Home
          </button>
          <a href="#features" className="hover:text-blue-600 transition">Features</a>
          <a href="#pricing" className="hover:text-blue-600 transition">Pricing</a>
          <a href="#about" className="hover:text-blue-600 transition">About</a>
          <Link
            to="/login"
            className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-gray-900 transition"
          >
            Login
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
      {/* Left: Text */}
      <div className="text-center md:text-left">
      <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
        AI-Powered Marketing for Ambitious Brands
      </h2>
      <p className="text-gray-600 mb-8 max-w-md md:max-w-full">
        Adora helps you create high-converting campaigns, spy on competitors, and ride marketing trends — all powered by AI.
      </p>
      <a
        href="#features"
        className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition"
      >
        Get Started
      </a>
      </div>

    {/* Right: Image */}
    <div className="flex justify-center md:justify-end">
      <img
        src="src/assets/homepage_image.png"
        alt="Adora dashboard preview"
        className="w-full max-w-x"
      />
    </div>
  </div>
</section>


      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 px-6">
        <h3 className="text-3xl font-bold text-center mb-12">Features</h3>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <h4 className="text-xl font-semibold mb-2">Campaign Generator</h4>
            <p>Create high-performing ads, emails, and content instantly.</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <h4 className="text-xl font-semibold mb-2">Spy on Competitors</h4>
            <p>See what your competitors are running and gain an edge.</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <h4 className="text-xl font-semibold mb-2">Trend Tracking</h4>
            <p>Discover viral marketing trends across TikTok, Google, and more.</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6">
        <h3 className="text-3xl font-bold text-center mb-12">Pricing</h3>
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="border rounded-lg p-6 text-center shadow-sm">
            <h4 className="text-xl font-bold mb-2">Starter</h4>
            <p className="text-2xl font-semibold">$0</p>
            <p className="text-sm mb-4 text-gray-500">For solo creators</p>
            <ul className="text-sm text-left list-disc ml-4 mb-4">
              <li>Basic AI tools</li>
              <li>5 competitor checks</li>
              <li>Limited trends</li>
            </ul>
            <button className="bg-blue-600 text-white w-full py-2 rounded-full font-semibold hover:bg-blue-700 transition">
              Choose Plan
            </button>
          </div>
          <div className="border-2 border-blue-600 rounded-lg p-6 text-center shadow-lg">
            <h4 className="text-xl font-bold mb-2">Pro</h4>
            <p className="text-2xl font-semibold">$29/mo</p>
            <p className="text-sm mb-4 text-gray-500">For growing brands</p>
            <ul className="text-sm text-left list-disc ml-4 mb-4">
              <li>Unlimited campaigns</li>
              <li>50 competitor checks</li>
              <li>Daily trend updates</li>
            </ul>
            <button className="bg-blue-600 text-white w-full py-2 rounded-full font-semibold hover:bg-blue-700 transition">
              Choose Plan
            </button>
          </div>
          <div className="border rounded-lg p-6 text-center shadow-sm">
            <h4 className="text-xl font-bold mb-2">Enterprise</h4>
            <p className="text-2xl font-semibold">Custom</p>
            <p className="text-sm mb-4 text-gray-500">Tailored for teams</p>
            <ul className="text-sm text-left list-disc ml-4 mb-4">
              <li>Custom integrations</li>
              <li>Priority support</li>
              <li>Team collaboration</li>
            </ul>
            <button className="bg-blue-600 text-white w-full py-2 rounded-full font-semibold hover:bg-blue-700 transition">
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-100 px-6">
        <h3 className="text-3xl font-bold text-center mb-6">About Adora</h3>
        <p className="max-w-3xl text-center mx-auto text-gray-700">
          Adora was born to simplify modern marketing. Built by marketers for marketers, our platform removes the guesswork
          and lets brands focus on what matters most: connection, creativity, and conversion.
        </p>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 py-6">
        © {new Date().getFullYear()} Adora. All rights reserved.
      </footer>
    </div>
  );
}
