import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import CreateWorkspaceModal from '../common/CreateWorkspaceModal';
import SearchModal from '../common/SearchModal';
import { Menu } from 'lucide-react';

export default function AppLayout() {
  const { isAuthenticated, loading, activeWorkspace } = useAuth();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [createWorkspaceOpen, setCreateWorkspaceOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [loading, isAuthenticated, navigate]);

  // Global Ctrl+K shortcut for search modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-bold text-slate-600 tracking-wide">Loading WorkSphere...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      {/* Sidebar (Desktop fixed, Mobile drawer) */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        onOpenCreateWorkspace={() => setCreateWorkspaceOpen(true)}
      />

      {/* Main Content Canvas */}
      <div className="lg:pl-68 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <Navbar
          onSearchClick={() => setSearchOpen(true)}
        />

        {/* Mobile menu trigger */}
        <div className="lg:hidden px-4 py-3 bg-white border-b border-slate-200 flex items-center justify-between shadow-2xs">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-300"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold text-blue-700 truncate">
            {activeWorkspace?.name || 'WorkSphere'}
          </span>
        </div>

        {/* Page Content Outlet */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto animate-fadeIn">
          <Outlet />
        </main>
      </div>

      {/* Modals */}
      <CreateWorkspaceModal
        isOpen={createWorkspaceOpen}
        onClose={() => setCreateWorkspaceOpen(false)}
      />

      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        workspaceId={activeWorkspace?.id}
        onSelectProject={(proj) => navigate(`/projects/${proj.id}`)}
      />
    </div>
  );
}
