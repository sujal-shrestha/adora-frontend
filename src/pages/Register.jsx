import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';


export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
  e.preventDefault();
  console.log('⏳ Submitting...');

  try {
    const res = await axios.post('http://localhost:10010/api/auth/register', form);

    alert('✅ Registered successfully');
    navigate('/login');
  } catch (err) {
    console.error(err.response?.data || err);
    setError(err.response?.data?.message || 'Registration failed. Try again.');
  }
};

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left side (Register Form) */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              required
              className="border px-4 py-2 rounded"
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="border px-4 py-2 rounded"
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              className="border px-4 py-2 rounded"
              onChange={handleChange}
            />
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Sign up
            </button>
          </form>
          <p className="text-sm text-center mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>

      {/* Right side (Branding) */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-5xl font-extrabold text-blue-600 mb-2">Adora</h2>
          <p className="text-lg font-medium text-gray-700">AI-Powered Marketing</p>
        </div>
      </div>
    </div>
  );
}
