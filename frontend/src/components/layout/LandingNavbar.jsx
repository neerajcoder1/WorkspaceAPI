import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowRight, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LandingNavbar() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/95 border-b border-slate-200/90 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:from-blue-700 group-hover:to-violet-700 transition">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-slate-900 font-sans">WorkSphere</span>
            <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">Workspace • Projects • Team</span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
          <a href="#features" className="hover:text-blue-600 transition">Features</a>
          <a href="#workflow" className="hover:text-blue-600 transition">How it Works</a>
          <a href="#architecture" className="hover:text-blue-600 transition">Architecture</a>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center space-x-4">
          {user ? (
            <Link
              to="/app"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm transition"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Go to App</span>
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-semibold text-slate-700 hover:text-blue-600 px-3 py-2 transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm transition transform active:scale-98"
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
