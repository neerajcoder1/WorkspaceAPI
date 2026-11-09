import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowRight, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LandingNavbar() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0B1020]/80 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 p-0.5 shadow-lg shadow-purple-900/30">
            <div className="w-full h-full bg-[#0B1020] rounded-[10px] flex items-center justify-center group-hover:bg-[#0B1020]/70 transition">
              <Layers className="w-5 h-5 text-purple-400 group-hover:text-blue-400 transition" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white font-sans">WorkSphere</span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">Workspace • Projects • Team</span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
          <a href="#features" className="hover:text-white transition">Features</a>
          <a href="#solutions" className="hover:text-white transition">Solutions</a>
          <a href="#workflow" className="hover:text-white transition">How it Works</a>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center space-x-4">
          {user ? (
            <Link
              to="/app"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-600/30 transition"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Go to App</span>
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2 transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-sm font-semibold shadow-lg shadow-purple-600/25 transition transform active:scale-98"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
