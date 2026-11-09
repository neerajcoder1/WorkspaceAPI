import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ShieldCheck } from 'lucide-react';

export default function LandingFooter() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 text-slate-600 text-sm font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
                <Layers className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">WorkSphere</span>
            </div>
            <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
              Collaborate. Build. Deliver. WorkSphere is the all-in-one workspace, project, and task management platform engineered for high-performance software teams.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full w-fit font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>All Systems Operational • REST API Active</span>
            </div>
          </div>

          {/* Product links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">Product</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href="#features" className="hover:text-blue-600 transition">Workspace Management</a></li>
              <li><a href="#features" className="hover:text-blue-600 transition">Project Workflows</a></li>
              <li><a href="#features" className="hover:text-blue-600 transition">Kanban Task Boards</a></li>
              <li><a href="#features" className="hover:text-blue-600 transition">Team Roles (RBAC)</a></li>
              <li><a href="#features" className="hover:text-blue-600 transition">Audit Logs & Activity</a></li>
            </ul>
          </div>

          {/* Solutions & Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href="#features" className="hover:text-blue-600 transition">Features Overview</a></li>
              <li><a href="#workflow" className="hover:text-blue-600 transition">How it Works</a></li>
              <li><Link to="/login" className="hover:text-blue-600 transition">Member Sign In</Link></li>
              <li><Link to="/register" className="hover:text-blue-600 transition">Create Workspace</Link></li>
            </ul>
          </div>

          {/* Security & Architecture */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">Architecture</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li className="flex items-center gap-1.5 text-slate-700 font-medium">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>JWT Authentication</span>
              </li>
              <li>bcrypt Password Hashing</li>
              <li>Zod Schema Validation</li>
              <li>MySQL Connection Pool</li>
              <li>Strict RBAC Authorization</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} WorkSphere Platform. All rights reserved.</p>
          <p className="flex items-center gap-1 text-slate-500">
            Built for modern engineering and product teams.
          </p>
        </div>
      </div>
    </footer>
  );
}
