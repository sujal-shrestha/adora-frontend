import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Register() {
  const [form, setForm] = useState({
    full_name: '',
    business_name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    console.log(form);
    // TODO: connect to backend
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            required
            className="border px-4 py-2 rounded"
            onChange={handleChange}
          />
          <input
            type="text"
            name="business_name"
            placeholder="Business Name"
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
          <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
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
  );
}
