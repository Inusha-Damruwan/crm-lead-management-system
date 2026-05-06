import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  CheckSquare,
} from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // LOGIN FUNCTION
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      // LOGIN API
      await login(email, password);

      // REDIRECT
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-700 flex items-center justify-center px-4 relative">

      {/* BACKGROUND GLOW */}
      <div className="absolute top-[-120px] left-[-120px] w-[350px] h-[350px] bg-cyan-400/20 blur-3xl rounded-full"></div>

      <div className="absolute bottom-[-150px] right-[-120px] w-[400px] h-[400px] bg-pink-500/20 blur-3xl rounded-full"></div>

      {/* LOGIN CARD */}
      <div className="relative w-full max-w-md">

        <div className="backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl rounded-[34px] p-8">

          {/* LOGO */}
          <div className="flex flex-col items-center text-center">

            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-2xl shadow-cyan-500/30 mb-5">
              <ShieldCheck className="text-white" size={40} />
            </div>

            <h1 className="text-5xl font-black text-white tracking-tight">
              CRM
            </h1>

            <p className="text-white/80 text-lg mt-3">
              Lead Management System
            </p>

            <div className="flex items-center gap-2 mt-5 text-cyan-300 text-sm">
              <Sparkles size={16} />
              <span>Enterprise Sri Lankan CRM Platform</span>
            </div>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="mt-6 bg-red-500/20 border border-red-400/30 text-red-100 px-4 py-3 rounded-2xl text-sm">
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">

            {/* EMAIL */}
            <div>
              <label className="block text-white/90 text-sm font-semibold mb-3">
                Email Address
              </label>

              <div className="relative">

                <Mail
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-cyan-200"
                  size={22}
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full h-16 rounded-2xl bg-white/10 border border-white/20 pl-14 pr-5 text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-white/90 text-sm font-semibold mb-3">
                Password
              </label>

              <div className="relative">

                <Lock
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-cyan-200"
                  size={22}
                />

                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full h-16 rounded-2xl bg-white/10 border border-white/20 pl-14 pr-14 text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-cyan-200"
                >
                  {showPassword ? (
                    <EyeOff size={22} />
                  ) : (
                    <Eye size={22} />
                  )}
                </button>

              </div>
            </div>

            {/* REMEMBER */}
            <div className="flex items-center justify-between text-sm">

              <label className="flex items-center gap-2 text-white/80 cursor-pointer">

                <CheckSquare
                  className="text-cyan-300"
                  size={18}
                />

                Remember me
              </label>

              <button
                type="button"
                className="text-cyan-300 hover:text-cyan-200 transition"
              >
                Forgot Password?
              </button>

            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-16 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 text-white text-2xl font-bold shadow-2xl shadow-cyan-500/30 hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

          </form>

        </div>
      </div>
    </div>
  );
};

export default Login;