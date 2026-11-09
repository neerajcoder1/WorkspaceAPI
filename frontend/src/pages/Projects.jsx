import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { projectAPI } from '../api/client';
import {
  Briefcase,
  Plus,
  Calendar,
  CheckCircle2,
  Users,
  Search,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import CreateProjectModal from '../components/common/CreateProjectModal';

export default function Projects() {
  const { activeWorkspace } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const fetchProjects = async () => {
    if (!activeWorkspace) return;
    setLoading(true);
    try {
      const params = statusFilter !== 'all' ? { status: statusFilter } : {};
      const res = await projectAPI.list(activeWorkspace.id, params);
      setProjects(res.data.data.projects || []);
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [activeWorkspace, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Projects</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Projects within <span className="text-blue-600 font-bold">{activeWorkspace?.name || 'workspace'}</span>
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center space-x-2 px-5 py-3 rounded-2xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-lg shadow-blue-500/25 transition self-start sm:self-auto"
        >
          <Plus className="w-5 h-5" />
          <span>New Project</span>
        </button>
      </div>

      {/* Status Filters */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-3 text-sm">
        {['all', 'planning', 'active', 'completed', 'archived'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-4 py-2 rounded-xl font-bold capitalize transition ${
              statusFilter === st
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => {
          const progress = proj.progress_percentage || 0;

          return (
            <div
              key={proj.id}
              onClick={() => navigate(`/projects/${proj.id}`)}
              className="p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-blue-500 hover:shadow-lg transition cursor-pointer flex flex-col justify-between space-y-5 shadow-sm group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full capitalize">
                    {proj.status.replace('_', ' ')}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {proj.completed_tasks}/{proj.total_tasks} tasks
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition mb-1">
                  {proj.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
                  {proj.description || 'No description provided.'}
                </p>
              </div>

              <div>
                {/* Progress bar */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-500">Progress</span>
                    <span className="font-extrabold text-blue-600">{progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100 font-medium">
                  <span>By {proj.creator_name || 'Team member'}</span>
                  <span className="flex items-center space-x-1 text-blue-600 font-bold group-hover:translate-x-1 transition">
                    <span>Open Board</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {projects.length === 0 && !loading && (
          <div className="col-span-3 text-center py-20 p-8 rounded-3xl bg-white border border-dashed border-slate-300">
            <Briefcase className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-500">No projects found with current filter.</p>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="mt-3 text-sm font-bold text-blue-600 hover:text-blue-700"
            >
              + Create a Project
            </button>
          </div>
        )}
      </div>

      <CreateProjectModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        workspaceId={activeWorkspace?.id}
        onProjectCreated={fetchProjects}
      />
    </div>
  );
}
