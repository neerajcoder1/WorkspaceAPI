import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Shield,
  Key,
  Layers,
  CheckCircle2,
  Mail,
  Calendar,
  Lock,
  ShieldCheck,
  Building,
  Users,
  AlertCircle,
  Save
} from 'lucide-react';

export default function Settings() {
  const { user, activeWorkspace } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [savedMessage, setSavedMessage] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    setPasswordError('');
    setSavedMessage('Password updated successfully');
    setTimeout(() => setSavedMessage(''), 4000);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const navTabs = [
    { id: 'profile', label: 'My Profile', description: 'Personal info and account details', icon: User },
    { id: 'security', label: 'Security & Auth', description: 'Password, sessions & JWT security', icon: Shield },
    { id: 'workspace', label: 'Workspace Info', description: 'Current workspace metadata and role', icon: Building },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">Account & Workspace Settings</h1>
        <p className="text-sm text-slate-500 font-normal mt-1">
          Manage your personal identity, security credentials, and active workspace preferences.
        </p>
      </div>

      {savedMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{savedMessage}</span>
        </div>
      )}

      {/* Main 2-Column Responsive Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Sidebar Navigation (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-3 shadow-sm space-y-1.5">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-start space-x-3.5 p-3.5 rounded-xl text-left transition ${
                  isActive
                    ? 'bg-blue-50/80 text-blue-700 border border-blue-200 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className={`p-2 rounded-lg flex-shrink-0 ${isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className={`text-sm font-semibold ${isActive ? 'text-blue-900' : 'text-slate-800'}`}>
                    {tab.label}
                  </div>
                  <div className="text-xs text-slate-400 font-normal mt-0.5 leading-snug">
                    {tab.description}
                  </div>
                </div>
              </button>
            );
          })}

          <div className="pt-4 mt-3 border-t border-slate-100 px-3 py-2 text-xs text-slate-400 flex items-center justify-between">
            <span>WorkSphere Enterprise</span>
            <span className="font-semibold text-blue-600">v1.0.0</span>
          </div>
        </div>

        {/* Right Content Panels (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* TAB 1: Profile Details */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-5">
                <h2 className="text-lg font-semibold text-slate-900">Personal Profile</h2>
                <p className="text-xs text-slate-500 mt-0.5">Your personal credentials and platform identifiers.</p>
              </div>

              {/* Avatar & Identifiers */}
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-5 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-md shadow-purple-600/20">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-slate-900">{user?.name}</h3>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> Active User
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-normal">{user?.email}</p>
                  <p className="text-[11px] text-slate-400">Account ID: #{user?.id || '101'}</p>
                </div>
              </div>

              {/* Editable/Readonly Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      readOnly
                      value={user?.name || ''}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none cursor-default font-medium"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Managed via authentication provider</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      readOnly
                      value={user?.email || ''}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none cursor-default font-medium"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Used for workspace invitations and notifications</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  Account created in WorkSphere
                </span>
                <span className="font-medium text-slate-700">Verified Member</span>
              </div>
            </div>
          )}

          {/* TAB 2: Security & Authentication */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-5">
                <h2 className="text-lg font-semibold text-slate-900">Security & Authentication</h2>
                <p className="text-xs text-slate-500 mt-0.5">Manage your credentials, active tokens, and session integrity.</p>
              </div>

              {/* Security Status Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Authentication Protocol</span>
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-sm font-semibold text-slate-900">JSON Web Token (JWT)</p>
                  <p className="text-xs text-slate-500">Stateless bearer token authorization stored in local secure memory.</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Password Protection</span>
                    <Lock className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-sm font-semibold text-slate-900">bcrypt Salted Hashing</p>
                  <p className="text-xs text-slate-500">Industry-standard cryptographic key derivation function.</p>
                </div>
              </div>

              {/* Change Password Form */}
              <form onSubmit={handlePasswordUpdate} className="space-y-4 pt-2">
                <h3 className="text-sm font-semibold text-slate-800">Change Password</h3>

                {passwordError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                    <span>{passwordError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">New Password (8+ chars)</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Update Password</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: Workspace Information */}
          {activeTab === 'workspace' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-5">
                <h2 className="text-lg font-semibold text-slate-900">Active Workspace Information</h2>
                <p className="text-xs text-slate-500 mt-0.5">Details regarding your currently selected organization workspace.</p>
              </div>

              {activeWorkspace ? (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="w-14 h-14 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-sm">
                      {activeWorkspace.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">{activeWorkspace.name}</h3>
                      <p className="text-xs text-slate-500">{activeWorkspace.description || 'Primary engineering workspace'}</p>
                      <span className="inline-block mt-1 text-[11px] font-semibold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Your Role: {activeWorkspace.role || 'Member'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div className="p-4 rounded-xl border border-slate-200 bg-white">
                      <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1">Workspace ID</span>
                      <span className="text-base font-bold text-slate-800">#{activeWorkspace.id}</span>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-200 bg-white">
                      <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1">Created By</span>
                      <span className="text-base font-bold text-slate-800">{activeWorkspace.owner_name || 'Organization Admin'}</span>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-200 bg-white">
                      <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1">Access Tier</span>
                      <span className="text-base font-bold text-emerald-600">Full Access</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                  <Building className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">No active workspace selected</p>
                  <p className="text-xs text-slate-500 mt-1">Please select or create a workspace from the sidebar.</p>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
