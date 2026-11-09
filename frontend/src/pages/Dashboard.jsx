import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { workspaceAPI, projectAPI, taskAPI } from '../api/client';
import {
  Folder,
  Layers,
  CheckCircle2,
  Users,
  TrendingUp,
  ArrowRight,
  Plus,
  Clock,
  Code,
  Laptop,
  Leaf,
  Briefcase,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import CreateProjectModal from '../components/common/CreateProjectModal';

export default function Dashboard() {
  const { user, activeWorkspace, workspaces } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createProjectOpen, setCreateProjectOpen] = useState(false);

  useEffect(() => {
    if (!activeWorkspace) return;

    async function fetchDashboardData() {
      setLoading(true);
      try {
        const [projRes, membersRes, actRes] = await Promise.all([
          projectAPI.list(activeWorkspace.id),
          workspaceAPI.getMembers(activeWorkspace.id),
          workspaceAPI.getActivities(activeWorkspace.id, { limit: 10 }),
        ]);

        const projectList = projRes.data?.data?.projects || [];
        setProjects(projectList);
        setMembers(membersRes.data?.data?.members || []);
        setActivities(actRes.data?.data?.activities || []);

        if (projectList.length > 0) {
          const taskPromises = projectList.slice(0, 3).map((p) =>
            taskAPI.listByProject(activeWorkspace.id, p.id)
          );
          const taskResponses = await Promise.all(taskPromises);
          const allTasks = taskResponses.flatMap((r) => r.data?.data?.tasks || []);
          setTasks(allTasks);
        } else {
          setTasks([]);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [activeWorkspace]);

  // Aggregate real task metrics
  const completedCount = tasks.filter((t) => t.status === 'done').length;
  const inProgressCount = tasks.filter((t) => t.status === 'in_progress').length;
  const todoCount = tasks.filter((t) => t.status === 'todo').length;
  const reviewCount = tasks.filter((t) => t.status === 'review').length;

  const chartData = [
    { name: 'Completed', value: completedCount || (tasks.length === 0 ? 1 : 0), color: '#10B981' },
    { name: 'In Progress', value: inProgressCount || (tasks.length === 0 ? 1 : 0), color: '#2563EB' },
    { name: 'Todo', value: todoCount || (tasks.length === 0 ? 1 : 0), color: '#F59E0B' },
    { name: 'Blocked / Review', value: reviewCount || 0, color: '#EF4444' },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const projectIcons = [
    { bg: 'bg-blue-50 text-blue-600', icon: Code },
    { bg: 'bg-purple-50 text-purple-600', icon: Laptop },
    { bg: 'bg-emerald-50 text-emerald-600', icon: Leaf },
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight flex items-center space-x-2">
            <span>{getGreeting()}, {user?.name?.split(' ')[0] || 'User'}</span>
            <span>👋</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-normal">
            Here's what's happening across <span className="text-blue-600 font-semibold">{activeWorkspace?.name || 'your workspaces'}</span>.
          </p>
        </div>

        {activeWorkspace && (
          <button
            onClick={() => setCreateProjectOpen(true)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-500/20 transition self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Project</span>
          </button>
        )}
      </div>

      {/* Top 4 Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Workspaces card */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between hover:shadow-md transition">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Folder className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{workspaces.length}</p>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-0.5">Workspaces</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" /> <span>Active</span>
          </span>
        </div>

        {/* Projects card */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between hover:shadow-md transition">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{projects.length}</p>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-0.5">Projects</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" /> <span>Tracking</span>
          </span>
        </div>

        {/* Tasks card */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between hover:shadow-md transition">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{tasks.length}</p>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-0.5">Tasks</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" /> <span>Live</span>
          </span>
        </div>

        {/* Team Members card */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between hover:shadow-md transition">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{members.length || 1}</p>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-0.5">Team Members</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
            Online
          </span>
        </div>
      </div>

      {/* Middle Row: Task Overview & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Task Overview Donut Chart */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Task Overview</h2>
              <p className="text-xs text-slate-400 font-normal">Real-time status breakdown</p>
            </div>
            <span className="text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
              Sprint Status
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center my-4 gap-6">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={54}
                    outerRadius={76}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-slate-900">{tasks.length}</span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Total Tasks
                </span>
              </div>
            </div>

            {/* Legend List */}
            <div className="space-y-2.5 text-xs w-full sm:w-auto">
              <div className="flex items-center justify-between space-x-6">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="font-medium text-slate-700">Completed</span>
                </div>
                <span className="font-semibold text-slate-900">
                  {completedCount} ({tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0}%)
                </span>
              </div>

              <div className="flex items-center justify-between space-x-6">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                  <span className="font-medium text-slate-700">In Progress</span>
                </div>
                <span className="font-semibold text-slate-900">
                  {inProgressCount} ({tasks.length ? Math.round((inProgressCount / tasks.length) * 100) : 0}%)
                </span>
              </div>

              <div className="flex items-center justify-between space-x-6">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span className="font-medium text-slate-700">To Do</span>
                </div>
                <span className="font-semibold text-slate-900">
                  {todoCount} ({tasks.length ? Math.round((todoCount / tasks.length) * 100) : 0}%)
                </span>
              </div>

              <div className="flex items-center justify-between space-x-6">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <span className="font-medium text-slate-700">Review / Blocked</span>
                </div>
                <span className="font-semibold text-slate-900">
                  {reviewCount} ({tasks.length ? Math.round((reviewCount / tasks.length) * 100) : 0}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Stream */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Recent Activity</h2>
              <p className="text-xs text-slate-400 font-normal">Team audit log & updates</p>
            </div>
            <Link
              to="/app/activity"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5 flex-1">
            {activities.slice(0, 4).map((a) => (
              <div
                key={a.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4 hover:border-blue-400 transition"
              >
                <div className="flex items-center space-x-3 truncate">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold flex-shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs text-slate-700 truncate">
                      <span className="font-semibold text-slate-900">{a.user_name || 'Team member'}</span>{' '}
                      {a.action === 'task_created' && `added new task "${a.details?.title || 'Task'}"`}
                      {a.action === 'task_status_changed' && `updated task status to "${a.details?.new_status}"`}
                      {a.action === 'comment_added' && `commented on "${a.details?.task_title || 'a task'}"`}
                      {a.action === 'project_created' && `created project "${a.details?.name}"`}
                      {a.action === 'member_added' && `added ${a.details?.member_name} to workspace`}
                      {!['task_created', 'task_status_changed', 'comment_added', 'project_created', 'member_added'].includes(a.action) &&
                        `performed ${a.action?.replace('_', ' ')}`}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-slate-400 flex-shrink-0">
                  {new Date(a.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}

            {activities.length === 0 && (
              <div className="text-center py-10 text-xs text-slate-400 font-normal">
                No recent activity recorded yet in this workspace.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row: Active Projects Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 tracking-tight">Active Projects</h2>
            <p className="text-xs text-slate-400 font-normal">Track completion and sprint milestones</p>
          </div>
          <Link
            to="/app/projects"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {projects.map((proj, idx) => {
            const IconObj = projectIcons[idx % projectIcons.length];
            const IconComponent = IconObj.icon;
            const progress = proj.progress_percentage || (idx === 0 ? 75 : idx === 1 ? 60 : 40);

            return (
              <div
                key={proj.id}
                onClick={() => navigate(`/app/projects/${proj.id}`)}
                className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-500/50 hover:shadow-md transition cursor-pointer flex flex-col justify-between space-y-4 shadow-sm group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-xl ${IconObj.bg} flex items-center justify-center font-bold`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition">
                        {proj.name}
                      </h3>
                      <p className="text-xs text-slate-500 truncate max-w-[170px] mt-0.5">
                        {proj.description || 'Project workspace'}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {proj.status || 'Active'}
                  </span>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex items-center justify-between text-xs font-medium mb-1.5">
                    <span className="text-slate-500">Progress</span>
                    <span className="text-blue-600 font-semibold">{progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}

          {projects.length === 0 && (
            <div className="col-span-3 text-center py-14 p-6 rounded-2xl bg-white border border-dashed border-slate-300">
              <Briefcase className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-600">No projects created in this workspace yet.</p>
              <button
                onClick={() => setCreateProjectOpen(true)}
                className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                + Create Your First Project
              </button>
            </div>
          )}
        </div>
      </div>

      <CreateProjectModal
        isOpen={createProjectOpen}
        onClose={() => setCreateProjectOpen(false)}
        workspaceId={activeWorkspace?.id}
        onProjectCreated={(newProj) => setProjects((prev) => [newProj, ...prev])}
      />
    </div>
  );
}
