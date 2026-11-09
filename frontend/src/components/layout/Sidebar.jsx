import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Briefcase,
  CheckSquare,
  Activity,
  Users,
  Settings,
  Plus,
  Layers,
} from 'lucide-react';

export default function Sidebar({ onOpenCreateWorkspace, mobileOpen, onCloseMobile }) {
  const { workspaces, activeWorkspace, selectWorkspace } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/app', icon: LayoutDashboard },
    { label: 'Workspaces', path: '/app/workspaces', icon: Layers },
    { label: 'Projects', path: '/app/projects', icon: Briefcase },
    { label: 'Tasks', path: '/app/tasks', icon: CheckSquare },
    { label: 'Activity', path: '/app/activity', icon: Activity },
    { label: 'Team', path: '/app/team', icon: Users },
    { label: 'Settings', path: '/app/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-68 bg-white border-r border-slate-200/90 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-18 flex items-center px-6 border-b border-slate-200/90 bg-white">
          <Link to="/app" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30 group-hover:bg-blue-700 transition">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg text-slate-900 tracking-tight">WorkSphere</span>
              <p className="text-[10px] text-blue-600 font-semibold uppercase tracking-wider">Workspace • Projects</p>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/app'}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200/50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Workspaces List Section */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between px-3 mb-2.5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                My Workspaces
              </span>
              <button
                onClick={onOpenCreateWorkspace}
                title="Create Workspace"
                className="w-6 h-6 rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white flex items-center justify-center transition border border-blue-200/60 shadow-2xs"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              {workspaces.map((ws) => {
                const isSelected = activeWorkspace?.id === ws.id;

                return (
                  <button
                    key={ws.id}
                    onClick={() => {
                      selectWorkspace(ws);
                      onCloseMobile?.();
                    }}
                    className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs transition text-left ${
                      isSelected
                        ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200/60'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {ws.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="truncate flex-1">{ws.name}</span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                    )}
                  </button>
                );
              })}

              {workspaces.length === 0 && (
                <div className="text-center py-4 px-2 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <p className="text-xs text-slate-500">No workspaces yet</p>
                  <button
                    onClick={onOpenCreateWorkspace}
                    className="mt-1.5 text-xs text-blue-600 hover:underline font-semibold"
                  >
                    + Create One
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Current Active Workspace Footer */}
        {activeWorkspace && (
          <div className="p-4 border-t border-slate-200/90 bg-slate-50/80">
            <div className="flex items-center space-x-3 p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                {activeWorkspace.name.charAt(0).toUpperCase()}
              </div>
              <div className="truncate flex-1">
                <p className="text-xs font-semibold text-slate-900 truncate">{activeWorkspace.name}</p>
                <p className="text-[11px] text-blue-600 font-medium capitalize">
                  {activeWorkspace.role || 'Member'}
                </p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
