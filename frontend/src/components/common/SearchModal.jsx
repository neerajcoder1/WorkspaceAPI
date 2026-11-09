import React, { useState, useEffect } from 'react';
import { projectAPI, taskAPI, workspaceAPI } from '../../api/client';
import { Search, X, Briefcase, CheckSquare, User, ArrowRight } from 'lucide-react';

export default function SearchModal({ isOpen, onClose, workspaceId, onSelectTask, onSelectProject }) {
  const [query, setQuery] = useState('');
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !workspaceId) return;

    async function loadData() {
      setLoading(true);
      try {
        const [projRes, membersRes] = await Promise.all([
          projectAPI.list(workspaceId),
          workspaceAPI.getMembers(workspaceId),
        ]);
        setProjects(projRes.data.data.projects || []);
        setMembers(membersRes.data.data.members || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [isOpen, workspaceId]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredProjects = q
    ? projects.filter((p) => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q))
    : projects.slice(0, 3);

  const filteredMembers = q
    ? members.filter((m) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q))
    : members.slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden">
        {/* Search Input Header */}
        <div className="p-4.5 border-b border-slate-200 flex items-center space-x-3 bg-slate-50">
          <Search className="w-5 h-5 text-blue-600" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects or team members..."
            className="flex-1 bg-transparent text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none"
          />
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="p-5 max-h-96 overflow-y-auto space-y-5">
          {/* Projects */}
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 px-2">
              Projects
            </div>
            <div className="space-y-1">
              {filteredProjects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    onSelectProject?.(p);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-blue-50/70 text-left transition group"
                >
                  <div className="flex items-center space-x-3.5 truncate">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition">
                        {p.name}
                      </p>
                      <p className="text-xs text-slate-500 font-medium truncate">
                        {p.status} • {p.completed_tasks}/{p.total_tasks} tasks
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
                </button>
              ))}

              {filteredProjects.length === 0 && (
                <p className="text-xs text-slate-400 px-3 py-1 font-medium">No matching projects</p>
              )}
            </div>
          </div>

          {/* Members */}
          <div className="border-t border-slate-100 pt-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 px-2">
              Team Members
            </div>
            <div className="space-y-1">
              {filteredMembers.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                      {m.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{m.name}</p>
                      <p className="text-xs text-slate-500 font-medium">{m.email}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full capitalize">
                    {m.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
