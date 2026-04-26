import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, Input, Modal, Loader } from '@/components';
import { formatCurrency } from '@/utils';
import { useGroups } from '@/hooks/useGroups';
import { useSelector } from 'react-redux';

export default function Groups() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [creating, setCreating] = useState(false);
  const { groups, fetchGroups, createGroup, loading, error } = useGroups();
  const user = useSelector((s) => s.auth.user);

  useEffect(() => {
    fetchGroups();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = groups.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async () => {
    if (!newGroupName.trim()) return;
    try {
      setCreating(true);
      await createGroup({ name: newGroupName.trim(), description: newGroupDesc.trim() });
      setShowCreate(false);
      setNewGroupName('');
      setNewGroupDesc('');
    } catch {
      // error in redux state
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="w-full px-5 pt-6 pb-12">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[24px] font-bold text-text-primary tracking-tight">Groups</h1>
          <p className="text-[14px] text-text-secondary mt-1">{groups.length} active groups</p>
        </div>
        <Button size="sm" onClick={() => setShowCreate(true)}>+ New Group</Button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-danger-50 border border-danger-200 rounded-lg text-danger-700 text-[13px]">
          {error}
        </div>
      )}

      {/* Search */}
      <div className="mb-4">
        <Input
          placeholder="Search groups…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          containerClassName="max-w-xs"
        />
      </div>

      {/* Groups list */}
      {loading ? (
        <div className="py-16 flex justify-center"><Loader /></div>
      ) : (
        <div className="bg-surface-raised rounded-xl border border-border shadow-sm overflow-hidden">
          {filtered.map((group, index) => (
            <button
              key={group._id}
              onClick={() => navigate(`/groups/${group._id}`)}
              className={`w-full text-left flex items-center justify-between px-5 py-4 hover:bg-surface-sunken transition-all duration-200 active:bg-surface cursor-pointer ${
                index !== filtered.length - 1 ? 'border-b border-border/60' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-[20px] shrink-0">
                  💰
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-text-primary">{group.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[12px] text-text-tertiary">
                      {group.member_count || group.members?.length || 0} members · {group.description || 'No description'}
                    </span>
                  </div>
                </div>
              </div>
              <svg className="text-text-tertiary shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          ))}

          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-[14px] text-text-tertiary">
                {search ? `No groups matching "${search}"` : 'No groups yet. Create one!'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Create Group Modal */}
      <Modal
        open={showCreate}
        onClose={() => { setShowCreate(false); setNewGroupName(''); setNewGroupDesc(''); }}
        title="Create a new group"
        maxWidth="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => { setShowCreate(false); setNewGroupName(''); setNewGroupDesc(''); }}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!newGroupName.trim()} loading={creating}>
              Create Group
            </Button>
          </>
        }
      >
        <div className="py-2 space-y-4">
          <Input
            label="Group name"
            placeholder="e.g. Roommates, Trip to Goa…"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            autoFocus
          />
          <Input
            label="Description (optional)"
            placeholder="What is this group for?"
            value={newGroupDesc}
            onChange={(e) => setNewGroupDesc(e.target.value)}
          />
          <p className="text-[13px] text-text-secondary">
            You can add members after creating the group.
          </p>
        </div>
      </Modal>
    </div>
  );
}
