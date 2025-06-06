import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill out all fields');
      return;
    }

    if (email === 'admin' && password === 'admin1234') {
      navigate('/dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6">Log in</h1>
          {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Email or Username"
              className="border px-4 py-2 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="border px-4 py-2 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex justify-between text-sm">
              <Link to="/forgot-password" className="text-blue-600 hover:underline">
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700 transition"
            >
              Log in
            </button>
          </form>
          <p className="text-sm text-center mt-4">
            Don’t have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
          <div className="flex justify-center gap-4 mt-6 text-xs text-gray-500">
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy</Link>
          </div>
        </div>
      </div>

      {/* Right - Branding */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-5xl font-extrabold text-blue-600 mb-2">Adora</h2>
          <p className="text-lg font-medium text-gray-700">AI-Powered Marketing</p>
        </div>
      </div>
    </div>
  );
}
