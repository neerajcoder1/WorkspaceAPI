import React, { useState, useEffect } from 'react';
import { taskAPI } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import {
  X,
  Calendar,
  User,
  Send,
  Clock,
  MessageSquare,
  AlertCircle,
  Tag,
  CheckCircle2,
} from 'lucide-react';

export default function TaskDetailsModal({
  isOpen,
  onClose,
  taskId,
  workspaceMembers = [],
  onTaskUpdated,
}) {
  const { user } = useAuth();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('comments');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen || !taskId) return;

    async function fetchTaskAndComments() {
      setLoading(true);
      setError('');
      try {
        const [taskRes, commentsRes] = await Promise.all([
          taskAPI.get(taskId),
          taskAPI.getComments(taskId),
        ]);
        setTask(taskRes.data.data.task);
        setComments(commentsRes.data.data.comments || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load task details');
      } finally {
        setLoading(false);
      }
    }

    fetchTaskAndComments();
  }, [isOpen, taskId]);

  if (!isOpen) return null;

  const handleStatusChange = async (newStatus) => {
    try {
      const res = await taskAPI.updateStatus(taskId, newStatus);
      const updated = res.data.data.task;
      setTask(updated);
      onTaskUpdated?.(updated);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handlePriorityChange = async (newPriority) => {
    try {
      const res = await taskAPI.update(taskId, { priority: newPriority });
      const updated = res.data.data.task;
      setTask(updated);
      onTaskUpdated?.(updated);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update priority');
    }
  };

  const handleAssigneeChange = async (newAssigneeId) => {
    try {
      const res = await taskAPI.update(taskId, {
        assigned_to: newAssigneeId ? Number(newAssigneeId) : null,
      });
      const updated = res.data.data.task;
      setTask(updated);
      onTaskUpdated?.(updated);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update assignee');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    try {
      const res = await taskAPI.addComment(taskId, newComment.trim());
      setComments((prev) => [...prev, res.data.data.comment]);
      setNewComment('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-7 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-2.5">
            <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
              {task?.project_name || 'Task Details'}
            </span>
            <span className="text-xs font-bold text-slate-400">#{task?.id}</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="p-16 text-center text-slate-500 text-sm font-semibold">
            Loading task details...
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-7 space-y-6">
            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Title & Description */}
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 mb-2 leading-snug">{task?.title}</h1>
              <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200 font-medium">
                {task?.description || 'No description provided for this task.'}
              </p>
            </div>

            {/* Meta Attributes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4.5 rounded-2xl bg-slate-50 border border-slate-200">
              {/* Assignee */}
              <div>
                <span className="block text-xs font-bold text-slate-500 mb-1.5">
                  Assignee
                </span>
                <select
                  value={task?.assigned_to || ''}
                  onChange={(e) => handleAssigneeChange(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-800 text-xs font-semibold rounded-xl px-2.5 py-2 focus:outline-none focus:border-blue-600"
                >
                  <option value="">Unassigned</option>
                  {workspaceMembers.map((m) => (
                    <option key={m.user_id} value={m.user_id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <span className="block text-xs font-bold text-slate-500 mb-1.5">
                  Status
                </span>
                <select
                  value={task?.status || 'todo'}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-800 text-xs font-semibold rounded-xl px-2.5 py-2 focus:outline-none focus:border-blue-600"
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="review">In Review</option>
                  <option value="done">Completed</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <span className="block text-xs font-bold text-slate-500 mb-1.5">
                  Priority
                </span>
                <select
                  value={task?.priority || 'medium'}
                  onChange={(e) => handlePriorityChange(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-800 text-xs font-semibold rounded-xl px-2.5 py-2 focus:outline-none focus:border-blue-600 capitalize"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              {/* Due Date */}
              <div>
                <span className="block text-xs font-bold text-slate-500 mb-1.5">
                  Due Date
                </span>
                <div className="text-xs text-slate-700 font-semibold bg-white border border-slate-300 rounded-xl px-3 py-2 flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>
                    {task?.due_date
                      ? new Date(task.due_date).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })
                      : 'No date'}
                  </span>
                </div>
              </div>
            </div>

            {/* Comments Thread */}
            <div className="border-t border-slate-100 pt-4">
              <div className="flex items-center space-x-2 text-sm font-bold text-slate-900 mb-3">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <span>Comments ({comments.length})</span>
              </div>

              <div className="space-y-3">
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {comments.map((c) => (
                    <div
                      key={c.id}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900">{c.user_name}</span>
                        <span className="text-slate-400 font-medium">
                          {new Date(c.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 font-medium">{c.comment}</p>
                    </div>
                  ))}

                  {comments.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-4 font-medium">
                      No comments yet. Start the conversation!
                    </p>
                  )}
                </div>

                {/* Comment Form */}
                <form onSubmit={handleAddComment} className="flex items-center space-x-2 pt-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-2xs">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment to this task..."
                    className="flex-1 bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm font-medium rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100 transition"
                  />
                  <button
                    type="submit"
                    disabled={submittingComment || !newComment.trim()}
                    className="p-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 transition shadow-xs"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
