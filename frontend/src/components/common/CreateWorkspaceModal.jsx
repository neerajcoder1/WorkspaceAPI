import React, { useState } from 'react';
import { workspaceAPI } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { X, Layers, AlertCircle } from 'lucide-react';

export default function CreateWorkspaceModal({ isOpen, onClose }) {
  const { refreshWorkspaces, selectWorkspace } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await workspaceAPI.create({
        name: name.trim(),
        description: description.trim() || undefined,
      });
      const newWs = res.data.data.workspace;
      const updatedList = await refreshWorkspaces();
      if (updatedList) {
        const found = updatedList.find((w) => w.id === newWs.id);
        if (found) selectWorkspace(found);
      }
      setName('');
      setDescription('');
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create workspace');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-7 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-xl hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Create Workspace</h2>
            <p className="text-xs text-slate-500 font-medium">Set up an environment for your team</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Workspace Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. VisionX Engineering"
              className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 text-slate-900 placeholder-slate-400 text-sm font-medium rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-100 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Software development and product innovation team..."
              className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 text-slate-900 placeholder-slate-400 text-sm font-medium rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-100 transition resize-none"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-md shadow-blue-500/25 transition disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Workspace'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
