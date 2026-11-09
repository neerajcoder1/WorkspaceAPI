import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { workspaceAPI } from '../api/client';
import {
  Layers,
  Plus,
  Trash2,
  Calendar,
  Users,
  CheckCircle,
  ExternalLink,
  Shield,
} from 'lucide-react';
import CreateWorkspaceModal from '../components/common/CreateWorkspaceModal';

export default function Workspaces() {
  const { workspaces, activeWorkspace, selectWorkspace, refreshWorkspaces } = useAuth();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (workspaceId) => {
    if (!window.confirm('Are you sure you want to delete this workspace? This will delete all its projects and tasks.')) {
      return;
    }

    try {
      setDeletingId(workspaceId);
      await workspaceAPI.delete(workspaceId, 'DELETE');
      await refreshWorkspaces();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete workspace');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Workspaces</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Manage your collaborative team environments and permissions
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center space-x-2 px-5 py-3 rounded-2xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-lg shadow-blue-500/25 transition"
        >
          <Plus className="w-5 h-5" />
          <span>New Workspace</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workspaces.map((ws) => {
          const isSelected = activeWorkspace?.id === ws.id;

          return (
            <div
              key={ws.id}
              className={`p-6 rounded-3xl bg-white border transition flex flex-col justify-between space-y-5 shadow-sm ${
                isSelected ? 'border-blue-600 shadow-blue-500/10 ring-2 ring-blue-600/20' : 'border-slate-200/90 hover:border-blue-400'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-black text-lg flex items-center justify-center shadow-md shadow-blue-600/30">
                    {ws.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full capitalize">
                    {ws.role}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-1">{ws.name}</h3>
                <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
                  {ws.description || 'No description provided.'}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">
                  Created {new Date(ws.created_at).toLocaleDateString()}
                </span>

                <div className="flex items-center space-x-2">
                  {ws.role === 'owner' && (
                    <button
                      onClick={() => handleDelete(ws.id)}
                      disabled={deletingId === ws.id}
                      title="Delete Workspace"
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => selectWorkspace(ws)}
                    className={`px-4 py-2 rounded-xl font-bold text-xs transition ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs cursor-default'
                        : 'bg-slate-100 text-slate-800 hover:bg-slate-200/80 border border-slate-200'
                    }`}
                  >
                    {isSelected ? 'Active' : 'Switch'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <CreateWorkspaceModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </div>
  );
}
