import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { workspaceAPI } from '../api/client';
import {
  Activity as ActivityIcon,
  Clock,
  User,
  Filter,
  Layers,
  CheckCircle,
  MessageSquare,
  FilePlus,
  Briefcase,
} from 'lucide-react';

export default function Activity() {
  const { activeWorkspace } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    if (!activeWorkspace) return;

    async function fetchActivities() {
      setLoading(true);
      try {
        const params = typeFilter !== 'all' ? { entityType: typeFilter } : {};
        const res = await workspaceAPI.getActivities(activeWorkspace.id, params);
        setActivities(res.data.data.activities || []);
      } catch (err) {
        console.error('Failed to load activities:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchActivities();
  }, [activeWorkspace, typeFilter]);

  const getActivityIcon = (action) => {
    switch (action) {
      case 'task_created':
      case 'project_created':
        return <FilePlus className="w-4 h-4 text-blue-600" />;
      case 'task_status_changed':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'comment_added':
        return <MessageSquare className="w-4 h-4 text-indigo-600" />;
      case 'member_added':
        return <User className="w-4 h-4 text-amber-600" />;
      default:
        return <Clock className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Activity Log</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Real-time audit history and team actions in <span className="text-blue-600 font-bold">{activeWorkspace?.name || 'workspace'}</span>
          </p>
        </div>

        <div className="flex items-center space-x-2 text-sm">
          {['all', 'project', 'task', 'member'].map((f) => (
            <button
              key={f}
              onClick={() => setTypeFilter(f)}
              className={`px-4 py-2 rounded-xl font-bold capitalize transition ${
                typeFilter === f
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
        <div className="relative pl-7 space-y-7 before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {activities.map((a) => (
            <div key={a.id} className="relative flex items-start space-x-4">
              <div className="absolute -left-7 mt-0.5 w-7 h-7 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center shadow-xs">
                {getActivityIcon(a.action)}
              </div>

              <div className="flex-1 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-400 transition">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-slate-900 text-sm">{a.user_name || 'System'}</span>
                  <span className="text-xs text-slate-400 font-medium">
                    {new Date(a.created_at).toLocaleString()}
                  </span>
                </div>

                <p className="text-sm text-slate-700 font-medium">
                  {a.action === 'task_created' && `Created task "${a.details?.title}"`}
                  {a.action === 'task_status_changed' &&
                    `Changed task "${a.details?.title}" status from ${a.details?.old_status} to ${a.details?.new_status}`}
                  {a.action === 'comment_added' &&
                    `Commented on task "${a.details?.task_title}": "${a.details?.comment}"`}
                  {a.action === 'project_created' && `Created project "${a.details?.name}"`}
                  {a.action === 'project_updated' && `Updated project details`}
                  {a.action === 'member_added' &&
                    `Added ${a.details?.member_name} (${a.details?.member_email}) as ${a.details?.role}`}
                  {a.action === 'workspace_created' && `Created workspace "${a.details?.name}"`}
                </p>
              </div>
            </div>
          ))}

          {activities.length === 0 && !loading && (
            <p className="text-sm text-slate-400 py-12 text-center font-medium">
              No activity logs recorded yet in this workspace.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
