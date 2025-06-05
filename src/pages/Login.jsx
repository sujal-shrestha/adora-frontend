import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    console.log({ email, password });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6">Log in</h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              required
              className="border px-4 py-2 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              required
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
              className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
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
