import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Search, Bell, LogOut, User, Check, Layers, ChevronDown } from 'lucide-react';

export default function Navbar({ onSearchClick }) {
  const { user, activeWorkspace, workspaces, selectWorkspace, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [workspaceDropdownOpen, setWorkspaceDropdownOpen] = useState(false);

  return (
    <header className="h-18 border-b border-slate-200/90 bg-white/95 backdrop-blur-md px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Active workspace selector */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button
            onClick={() => setWorkspaceDropdownOpen(!workspaceDropdownOpen)}
            className="flex items-center space-x-2.5 text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200/80 border border-slate-300/80 px-3.5 py-2 rounded-xl transition shadow-xs"
          >
            <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold uppercase shadow-xs">
              {activeWorkspace?.name?.charAt(0) || 'W'}
            </div>
            <span className="truncate max-w-[160px] sm:max-w-[220px]">
              {activeWorkspace?.name || 'Select Workspace'}
            </span>
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </button>

          {workspaceDropdownOpen && (
            <div className="absolute left-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-fadeIn">
              <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Switch Workspace
              </div>
              <div className="max-h-60 overflow-y-auto">
                {workspaces.map((ws) => (
                  <button
                    key={ws.id}
                    onClick={() => {
                      selectWorkspace(ws);
                      setWorkspaceDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between hover:bg-blue-50/70 transition ${
                      activeWorkspace?.id === ws.id ? 'text-blue-700 font-semibold bg-blue-50/80' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3 truncate">
                      <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                        {ws.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="truncate font-medium">{ws.name}</span>
                    </div>
                    {activeWorkspace?.id === ws.id && <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center Search Input */}
      <div className="hidden md:flex items-center flex-1 max-w-lg mx-6">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects, tasks, or team members... (Ctrl K)"
            onClick={onSearchClick}
            readOnly
            className="w-full bg-slate-100 hover:bg-slate-100/80 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 pl-11 pr-16 py-2 rounded-xl focus:outline-none focus:border-blue-600 cursor-pointer transition font-normal"
          />
          <kbd className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] bg-white text-slate-500 font-semibold px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
            Ctrl K
          </kbd>
        </div>
      </div>

      {/* Right User Controls */}
      <div className="flex items-center space-x-3.5">
        {/* Notification Bell */}
        <button
          title="Notifications"
          className="relative p-2 text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-xl transition"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full"></span>
        </button>

        {/* User Profile Pill */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center space-x-2.5 pl-1.5 pr-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-full transition"
          >
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <span className="text-xs font-semibold text-slate-800 hidden sm:inline max-w-[130px] truncate">
              {user?.name || 'User'}
            </span>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-fadeIn">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate mt-0.5">{user?.email}</p>
              </div>
              <Link
                to="/app/settings"
                onClick={() => setProfileOpen(false)}
                className="flex items-center space-x-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                <User className="w-4 h-4 text-slate-400" />
                <span>Account Settings</span>
              </Link>
              <button
                onClick={() => {
                  setProfileOpen(false);
                  logout();
                }}
                className="w-full flex items-center space-x-2.5 px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 transition text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
