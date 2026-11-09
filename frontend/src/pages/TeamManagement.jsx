import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { workspaceAPI } from '../api/client';
import {
  Users,
  UserPlus,
  Mail,
  Calendar,
  Shield,
  MoreVertical,
  Check,
} from 'lucide-react';
import InviteMemberModal from '../components/common/InviteMemberModal';

export default function TeamManagement() {
  const { activeWorkspace } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  const fetchMembers = async () => {
    if (!activeWorkspace) return;
    setLoading(true);
    try {
      const res = await workspaceAPI.getMembers(activeWorkspace.id);
      setMembers(res.data.data.members || []);
    } catch (err) {
      console.error('Failed to load team members:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [activeWorkspace]);

  const roleBadges = {
    owner: 'bg-blue-50 text-blue-700 border border-blue-200',
    admin: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    member: 'bg-slate-100 text-slate-700 border border-slate-200',
  };

  return (
    <div className="space-y-6">
      {/* Workspace Banner */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-blue-600/30">
            {activeWorkspace?.name?.charAt(0) || 'W'}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {activeWorkspace?.name || 'Workspace Team'}
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-1">
              {activeWorkspace?.description || 'Software development and product innovation team.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setInviteModalOpen(true)}
          className="flex items-center space-x-2 px-5 py-3 rounded-2xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-lg shadow-blue-500/25 transition self-start md:self-auto"
        >
          <UserPlus className="w-5 h-5" />
          <span>Invite Member</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-8 border-b border-slate-200 text-sm font-bold px-2">
        <span className="pb-3.5 border-b-2 border-blue-600 text-blue-700 cursor-pointer">
          Team Members ({members.length})
        </span>
        <span className="pb-3.5 text-slate-500 hover:text-slate-900 cursor-pointer">Permissions & Roles</span>
      </div>

      {/* Members Directory Table */}
      <div className="rounded-3xl bg-white border border-slate-200/90 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-4 px-6">Member</th>
              <th className="py-4 px-6">Role</th>
              <th className="py-4 px-6">Joined Date</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-slate-50 transition">
                {/* Member Profile */}
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{member.name}</p>
                      <p className="text-xs text-slate-500 font-medium">{member.email}</p>
                    </div>
                  </div>
                </td>

                {/* Role Badge */}
                <td className="py-4 px-6">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold capitalize ${
                      roleBadges[member.role] || roleBadges.member
                    }`}
                  >
                    {member.role}
                  </span>
                </td>

                {/* Joined Date */}
                <td className="py-4 px-6 text-slate-500 font-medium text-sm">
                  {new Date(member.joined_at).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </td>

                {/* Actions Button */}
                <td className="py-4 px-6 text-right">
                  <button className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}

            {members.length === 0 && !loading && (
              <tr>
                <td colSpan={4} className="py-12 text-center text-slate-400 font-medium">
                  No members found in this workspace.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <InviteMemberModal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        workspaceId={activeWorkspace?.id}
        onMemberAdded={fetchMembers}
      />
    </div>
  );
}
