import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Layers,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  FolderKanban,
  CheckSquare,
  Users,
} from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) return;

    if (password.length < 8) {
      setError('Password must contain at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register(name.trim(), email.trim(), password);
      navigate('/app');
    } catch (err) {
      setError(
        err.response?.data?.errors?.[0]?.message ||
        err.response?.data?.message ||
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1020] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans selection:bg-purple-600 selection:text-white">
      
      {/* Top Navigation: Back to Home */}
      <div className="w-full max-w-5xl mb-4 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800/80 shadow-sm transition group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition" />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[660px]">
        
        {/* LEFT COLUMN: Branded Showcase */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#0B1020] via-[#111827] to-[#1E1B4B] p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
          <div className="absolute top-0 right-0 w-72 h-72 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

          {/* Brand Header */}
          <div className="relative z-10">
            <Link to="/" title="Return to WorkSphere home" className="inline-flex items-center space-x-3 group mb-8">
              <div className="w-10 h-10 rounded-xl bg-black border border-slate-700 flex items-center justify-center shadow-lg shadow-black/40 group-hover:border-slate-500 transition">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white block">WorkSphere</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold block">Team Platform</span>
              </div>
            </Link>

            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
                Start Building <br />
                With WorkSphere.
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Set up your team workspace in seconds. Streamline your project planning, task boards, and member collaboration.
              </p>
            </div>
          </div>

          {/* Value Points */}
          <div className="relative z-10 my-8 space-y-3 text-xs text-slate-300">
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Full Access to Kanban Boards & Tasks</span>
            </div>
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Multi-User Collaboration via Email</span>
            </div>
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Automatic Audit & Activity Logging</span>
            </div>
          </div>

          {/* Footer Security Badge */}
          <div className="relative z-10 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Zero Setup Fees • Instant Setup
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: Clean Registration Form */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto space-y-6">
            
            {/* Form Header */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  Create an Account
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Get started with your free WorkSphere team workspace today
                </p>
              </div>
              <Link
                to="/"
                className="hidden sm:inline-flex items-center text-xs font-semibold text-slate-400 hover:text-blue-600 transition pt-1"
              >
                ← Back to Home
              </Link>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-start space-x-2.5">
                <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Johnson"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password (min. 8 characters)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/25 transition disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="pt-4 text-center border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
              <span>
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500 hover:underline">
                  Sign in
                </Link>
              </span>
              <Link to="/" className="text-slate-400 hover:text-slate-600 font-medium sm:hidden">
                Home
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
