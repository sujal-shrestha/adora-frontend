import { Link, useNavigate } from 'react-router-dom';

export default function Homepage() {
  const navigate = useNavigate();

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
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              Unlock AI-Powered Marketing<br className="hidden md:block" /> for Ambitious Brands 🚀
            </h2>
            <p className="text-gray-600 mb-8 max-w-md md:max-w-lg">
              Create high-converting campaigns, spy on competitors, and ride the latest marketing trends — all powered by Adora’s AI.
            </p>
            <button
              onClick={() => navigate('/register')}
              className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition"
            >
              Get Started
            </button>
          </div>

          {/* Right: Image */}
          <div className="flex justify-center md:justify-end">
            <img
              src="/src/assets/homepage_image.png"
              alt="Adora dashboard preview"
              className="w-full max-w-md md:max-w-lg object-contain"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 px-6">
        <h3 className="text-3xl font-bold text-center mb-12">Powerful Features</h3>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { title: 'Campaign Generator', desc: 'Create high-performing ads, emails, and content instantly.' },
            { title: 'Spy on Competitors', desc: 'See what your competitors are running and gain an edge.' },
            { title: 'Trend Tracking', desc: 'Discover viral marketing trends across TikTok, Google, and more.' }
          ].map(({ title, desc }, i) => (
            <div key={i} className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-lg transition">
              <h4 className="text-xl font-semibold mb-2">{title}</h4>
              <p className="text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6">
        <h3 className="text-3xl font-bold text-center mb-12">Simple Pricing</h3>
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            {
              plan: 'Starter',
              price: '$0',
              subtitle: 'For solo creators',
              features: ['Basic AI tools', '5 competitor checks', 'Limited trends'],
              highlight: false,
              cta: 'Choose Plan',
            },
            {
              plan: 'Pro',
              price: '$29/mo',
              subtitle: 'For growing brands',
              features: ['Unlimited campaigns', '50 competitor checks', 'Daily trend updates'],
              highlight: true,
              cta: 'Choose Plan',
            },
            {
              plan: 'Enterprise',
              price: 'Custom',
              subtitle: 'Tailored for teams',
              features: ['Custom integrations', 'Priority support', 'Team collaboration'],
              highlight: false,
              cta: 'Contact Us',
            },
          ].map(({ plan, price, subtitle, features, highlight, cta }, idx) => (
            <div
              key={idx}
              className={`border ${highlight ? 'border-blue-600 shadow-lg' : 'shadow-sm'} rounded-lg p-6 text-center`}
            >
              <h4 className="text-xl font-bold mb-2">{plan}</h4>
              <p className="text-2xl font-semibold">{price}</p>
              <p className="text-sm mb-4 text-gray-500">{subtitle}</p>
              <ul className="text-sm text-left list-disc ml-4 mb-4">
                {features.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
              <button className="bg-blue-600 text-white w-full py-2 rounded-full font-semibold hover:bg-blue-700 transition">
                {cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-100 px-6">
        <h3 className="text-3xl font-bold text-center mb-6">About Adora</h3>
        <p className="max-w-3xl text-center mx-auto text-gray-700 leading-relaxed">
          Adora was built to simplify modern marketing. Created by marketers for marketers, our platform removes guesswork and
          lets brands focus on what matters most: connection, creativity, and conversion.
        </p>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 py-6">
        © {new Date().getFullYear()} Adora. All rights reserved.
      </footer>
    </div>
  );
}
