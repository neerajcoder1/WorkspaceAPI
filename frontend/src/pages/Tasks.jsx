import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { projectAPI, taskAPI, workspaceAPI } from '../api/client';
import {
  CheckSquare,
  Plus,
  Filter,
  Search,
  Calendar,
  Clock,
  User,
  ArrowUpDown,
} from 'lucide-react';
import CreateTaskModal from '../components/common/CreateTaskModal';
import TaskDetailsModal from '../components/common/TaskDetailsModal';

export default function Tasks() {
  const { activeWorkspace } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const fetchTasksData = async () => {
    if (!activeWorkspace) return;
    setLoading(true);
    try {
      const [projRes, membersRes] = await Promise.all([
        projectAPI.list(activeWorkspace.id),
        workspaceAPI.getMembers(activeWorkspace.id),
      ]);

      const projectList = projRes.data.data.projects || [];
      setProjects(projectList);
      setMembers(membersRes.data.data.members || []);

      if (projectList.length > 0) {
        const promises = projectList.map((p) =>
          taskAPI.listByProject(activeWorkspace.id, p.id)
        );
        const results = await Promise.all(promises);
        const all = results.flatMap((r) => r.data.data.tasks || []);
        setTasks(all);
      } else {
        setTasks([]);
      }
    } catch (err) {
      console.error('Failed to load tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasksData();
  }, [activeWorkspace]);

  const filteredTasks = tasks.filter((t) => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        t.project_name?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const priorityColors = {
    urgent: 'bg-rose-50 text-rose-700 border border-rose-200',
    high: 'bg-orange-50 text-orange-700 border border-orange-200',
    medium: 'bg-amber-50 text-amber-700 border border-amber-200',
    low: 'bg-blue-50 text-blue-700 border border-blue-200',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Task Directory</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Browse and manage tasks across all projects
          </p>
        </div>

        {projects.length > 0 && (
          <button
            onClick={() => setCreateTaskOpen(true)}
            className="flex items-center space-x-2 px-5 py-3 rounded-2xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-lg shadow-blue-500/25 transition self-start sm:self-auto"
          >
            <Plus className="w-5 h-5" />
            <span>New Task</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-4 text-sm">
        <div className="flex items-center space-x-3 flex-1 min-w-[220px]">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks by title or project..."
            className="w-full bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none text-sm font-medium"
          />
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-xl px-3.5 py-2 focus:outline-none focus:border-blue-600"
          >
            <option value="all">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="review">In Review</option>
            <option value="done">Completed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-xl px-3.5 py-2 focus:outline-none focus:border-blue-600"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="rounded-3xl bg-white border border-slate-200/90 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-4 px-6">Task</th>
              <th className="py-4 px-6">Project</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">Priority</th>
              <th className="py-4 px-6">Assignee</th>
              <th className="py-4 px-6">Due Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {filteredTasks.map((t) => (
              <tr
                key={t.id}
                onClick={() => setSelectedTaskId(t.id)}
                className="hover:bg-slate-50 cursor-pointer transition"
              >
                <td className="py-4 px-6 font-bold text-slate-900">{t.title}</td>
                <td className="py-4 px-6 text-blue-600 font-bold">
                  {t.project_name || 'Project'}
                </td>
                <td className="py-4 px-6">
                  <span className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200 capitalize">
                    {t.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className={`text-xs px-2.5 py-1 rounded-md font-bold capitalize ${priorityColors[t.priority]}`}>
                    {t.priority}
                  </span>
                </td>
                <td className="py-4 px-6 text-slate-600 font-medium">{t.assignee_name || 'Unassigned'}</td>
                <td className="py-4 px-6 text-slate-500 font-medium">
                  {t.due_date ? new Date(t.due_date).toLocaleDateString() : '—'}
                </td>
              </tr>
            ))}

            {filteredTasks.length === 0 && !loading && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                  No tasks match your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <CreateTaskModal
        isOpen={createTaskOpen}
        onClose={() => setCreateTaskOpen(false)}
        workspaceId={activeWorkspace?.id}
        projects={projects}
        members={members}
        onTaskCreated={() => fetchTasksData()}
      />

      <TaskDetailsModal
        isOpen={!!selectedTaskId}
        onClose={() => setSelectedTaskId(null)}
        taskId={selectedTaskId}
        workspaceMembers={members}
        onTaskUpdated={() => fetchTasksData()}
      />
    </div>
  );
}
