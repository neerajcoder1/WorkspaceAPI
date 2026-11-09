import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { projectAPI, taskAPI, workspaceAPI } from '../api/client';
import {
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  User,
  ArrowRight,
  ArrowLeft,
  Filter,
  Layers,
  ArrowUpDown,
  MoreVertical,
} from 'lucide-react';
import CreateTaskModal from '../components/common/CreateTaskModal';
import TaskDetailsModal from '../components/common/TaskDetailsModal';

export default function ProjectDetails() {
  const { projectId } = useParams();
  const { activeWorkspace } = useAuth();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('board');
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [targetColumn, setTargetColumn] = useState('todo');
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const fetchProjectData = async () => {
    if (!activeWorkspace || !projectId) return;
    setLoading(true);
    try {
      const [projRes, tasksRes, membersRes] = await Promise.all([
        projectAPI.get(activeWorkspace.id, projectId),
        taskAPI.listByProject(activeWorkspace.id, projectId),
        workspaceAPI.getMembers(activeWorkspace.id),
      ]);
      setProject(projRes.data.data.project);
      setTasks(tasksRes.data.data.tasks || []);
      setMembers(membersRes.data.data.members || []);
    } catch (err) {
      console.error('Failed to load project details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [activeWorkspace, projectId]);

  const handleStatusMove = async (taskId, newStatus) => {
    try {
      await taskAPI.updateStatus(taskId, newStatus);
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );
    } catch (err) {
      console.error('Failed to move task status:', err);
    }
  };

  const todoTasks = tasks.filter((t) => t.status === 'todo');
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress');
  const reviewTasks = tasks.filter((t) => t.status === 'review');
  const doneTasks = tasks.filter((t) => t.status === 'done');

  const columns = [
    { id: 'todo', title: 'To Do', count: todoTasks.length, items: todoTasks, dotColor: 'bg-amber-500' },
    { id: 'in_progress', title: 'In Progress', count: inProgressTasks.length, items: inProgressTasks, dotColor: 'bg-blue-600' },
    { id: 'review', title: 'Review', count: reviewTasks.length, items: reviewTasks, dotColor: 'bg-indigo-600' },
    { id: 'done', title: 'Completed', count: doneTasks.length, items: doneTasks, dotColor: 'bg-emerald-600' },
  ];

  const priorityColors = {
    urgent: 'bg-rose-50 text-rose-700 border border-rose-200',
    high: 'bg-orange-50 text-orange-700 border border-orange-200',
    medium: 'bg-amber-50 text-amber-700 border border-amber-200',
    low: 'bg-blue-50 text-blue-700 border border-blue-200',
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-500 text-base font-medium">
        Loading project board...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-500 text-base font-semibold">Project not found.</p>
        <Link to="/app/projects" className="mt-3 text-sm text-blue-600 font-bold hover:underline inline-block">
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Project Header */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{project.name}</h1>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full capitalize">
              {project.status.replace('_', ' ')}
            </span>
          </div>
          <p className="text-sm text-slate-500 max-w-2xl font-medium leading-relaxed">
            {project.description || 'Sprint & task management for this project.'}
          </p>
        </div>

        <button
          onClick={() => {
            setTargetColumn('todo');
            setCreateTaskOpen(true);
          }}
          className="flex items-center space-x-2 px-5 py-3 rounded-2xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-lg shadow-blue-500/25 transition self-start md:self-auto"
        >
          <Plus className="w-5 h-5" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-8 border-b border-slate-200 text-sm font-bold px-2">
        <button
          onClick={() => setActiveTab('board')}
          className={`pb-3.5 border-b-2 transition ${
            activeTab === 'board'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Kanban Board
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`pb-3.5 border-b-2 transition ${
            activeTab === 'tasks'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Tasks List ({tasks.length})
        </button>
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3.5 border-b-2 transition ${
            activeTab === 'overview'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Overview
        </button>
      </div>

      {/* Kanban Board Columns */}
      {activeTab === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-start">
          {columns.map((col) => (
            <div
              key={col.id}
              className="p-5 rounded-3xl bg-slate-100/90 border border-slate-200/90 flex flex-col min-h-[540px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center space-x-2.5">
                  <span className={`w-3 h-3 rounded-full ${col.dotColor}`} />
                  <h3 className="text-sm font-extrabold text-slate-900 tracking-wide">{col.title}</h3>
                  <span className="text-xs font-bold text-slate-600 bg-white border border-slate-200 px-2.5 py-0.5 rounded-full shadow-2xs">
                    {col.count}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setTargetColumn(col.id);
                    setCreateTaskOpen(true);
                  }}
                  className="w-7 h-7 rounded-lg bg-white hover:bg-blue-600 text-slate-500 hover:text-white flex items-center justify-center transition border border-slate-200 shadow-2xs"
                  title="Add task"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Tasks List */}
              <div className="space-y-3.5 flex-1 overflow-y-auto pr-0.5">
                {col.items.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTaskId(task.id)}
                    className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 hover:shadow-md transition cursor-pointer shadow-xs flex flex-col justify-between space-y-3 group"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition line-clamp-2 leading-snug">
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                          {task.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      {/* Priority badge */}
                      <span className={`px-2.5 py-0.5 rounded-md font-bold text-[11px] capitalize ${priorityColors[task.priority] || priorityColors.medium}`}>
                        {task.priority}
                      </span>

                      {/* Due date or Assignee */}
                      <div className="flex items-center space-x-2 text-slate-500">
                        {task.due_date && (
                          <div className="flex items-center space-x-1 text-slate-500 font-semibold">
                            <Clock className="w-3.5 h-3.5" />
                            <span>
                              {new Date(task.due_date).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                        )}

                        {task.assignee_name && (
                          <div
                            title={task.assignee_name}
                            className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shadow-2xs"
                          >
                            {task.assignee_name.charAt(0)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quick Move Buttons */}
                    <div className="flex items-center justify-end space-x-1.5 pt-1 border-t border-slate-50 opacity-0 group-hover:opacity-100 transition">
                      {col.id !== 'todo' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusMove(task.id, col.id === 'done' ? 'review' : col.id === 'review' ? 'in_progress' : 'todo');
                          }}
                          title="Move left"
                          className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-blue-600 text-slate-600 hover:text-white text-xs font-bold transition flex items-center space-x-1"
                        >
                          <ArrowLeft className="w-3 h-3" />
                          <span>Move</span>
                        </button>
                      )}
                      {col.id !== 'done' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusMove(task.id, col.id === 'todo' ? 'in_progress' : col.id === 'in_progress' ? 'review' : 'done');
                          }}
                          title="Move right"
                          className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-blue-600 text-slate-600 hover:text-white text-xs font-bold transition flex items-center space-x-1"
                        >
                          <span>Next</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {col.items.length === 0 && (
                  <div className="h-32 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center text-xs font-medium text-slate-400">
                    No tasks in {col.title.toLowerCase()}
                  </div>
                )}
              </div>

              {/* Add Task footer button */}
              <button
                onClick={() => {
                  setTargetColumn(col.id);
                  setCreateTaskOpen(true);
                }}
                className="mt-4 w-full py-2.5 rounded-2xl text-xs font-bold text-slate-600 hover:text-blue-700 bg-white hover:bg-blue-50 border border-slate-200/90 shadow-2xs flex items-center justify-center space-x-1.5 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Task</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tasks Table View */}
      {activeTab === 'tasks' && (
        <div className="rounded-3xl bg-white border border-slate-200/90 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-4 px-6">Task</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Priority</th>
                <th className="py-4 px-6">Assignee</th>
                <th className="py-4 px-6">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {tasks.map((t) => (
                <tr
                  key={t.id}
                  onClick={() => setSelectedTaskId(t.id)}
                  className="hover:bg-slate-50 cursor-pointer transition"
                >
                  <td className="py-4 px-6 font-bold text-slate-900">{t.title}</td>
                  <td className="py-4 px-6 capitalize">
                    <span className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
                      {t.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`text-xs px-2.5 py-1 rounded-md font-bold capitalize ${priorityColors[t.priority]}`}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-medium text-slate-700">{t.assignee_name || 'Unassigned'}</td>
                  <td className="py-4 px-6 text-slate-500 font-medium">
                    {t.due_date ? new Date(t.due_date).toLocaleDateString() : '—'}
                  </td>
                </tr>
              ))}
              {tasks.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 font-medium">
                    No tasks found in this project.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Overview View */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Project Information</h3>
            <div className="text-sm space-y-2 text-slate-600 font-medium">
              <p><span className="text-slate-400">Start Date:</span> {project.start_date || 'Not set'}</p>
              <p><span className="text-slate-400">Due Date:</span> {project.due_date || 'Not set'}</p>
              <p><span className="text-slate-400">Created by:</span> {project.creator_name}</p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Task Completion</h3>
            <p className="text-3xl font-black text-blue-600">{project.progress_percentage}%</p>
            <p className="text-xs text-slate-500 font-semibold">
              {project.completed_tasks} of {project.total_tasks} tasks completed
            </p>
          </div>
        </div>
      )}

      {/* Modals */}
      <CreateTaskModal
        isOpen={createTaskOpen}
        onClose={() => setCreateTaskOpen(false)}
        workspaceId={activeWorkspace?.id}
        projectId={projectId}
        members={members}
        initialStatus={targetColumn}
        onTaskCreated={(newTask) => setTasks((prev) => [newTask, ...prev])}
      />

      <TaskDetailsModal
        isOpen={!!selectedTaskId}
        onClose={() => setSelectedTaskId(null)}
        taskId={selectedTaskId}
        workspaceMembers={members}
        onTaskUpdated={(updated) =>
          setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
        }
      />
    </div>
  );
}
