import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ShieldCheck, Heart } from 'lucide-react';

export default function LandingFooter() {
  return (
    <footer className="bg-[#070B16] border-t border-slate-800 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white">
                <Layers className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">WorkSphere</span>
            </div>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              Collaborate. Build. Deliver. WorkSphere is the all-in-one workspace, project, and task management platform engineered for high-performance teams.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-3 py-1.5 rounded-full w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>All Systems Operational • REST API Active</span>
            </div>
          </div>

          {/* Product links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="hover:text-white transition">Workspace Management</a></li>
              <li><a href="#features" className="hover:text-white transition">Project Workflows</a></li>
              <li><a href="#features" className="hover:text-white transition">Kanban Task Boards</a></li>
              <li><a href="#features" className="hover:text-white transition">Team Roles (RBAC)</a></li>
              <li><a href="#features" className="hover:text-white transition">Audit Logs & Activity</a></li>
            </ul>
          </div>

          {/* Solutions & Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="http://localhost:5000/api/docs" target="_blank" rel="noreferrer" className="hover:text-white transition">Swagger API Docs</a></li>
              <li><a href="#workflow" className="hover:text-white transition">Workflow Guide</a></li>
              <li><Link to="/login" className="hover:text-white transition">Member Sign In</Link></li>
              <li><Link to="/register" className="hover:text-white transition">Create Workspace</Link></li>
            </ul>
          </div>

          {/* Security & Architecture */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Architecture</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>JWT Authentication</span>
              </li>
              <li className="text-slate-400">bcrypt Hashing</li>
              <li className="text-slate-400">Zod Schema Validation</li>
              <li className="text-slate-400">MySQL Connection Pool</li>
              <li className="text-slate-400">Strict RBAC Authorization</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} WorkSphere SaaS Platform. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with precision for agile engineering teams.
          </p>
        </div>
      </div>
    </footer>
  );
}
