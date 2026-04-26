import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Avatar, Button, Input, Modal, Loader } from '@/components';
import { formatCurrency } from '@/utils';
import { groupsApi, expensesApi } from '@/api';
import { useSelector } from 'react-redux';
import AddExpenseModal from '@/components/AddExpenseModal';

export default function GroupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);

  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState('');

  const fetchGroupData = async () => {
    try {
      setLoading(true);
      const [groupRes, expensesRes, balancesRes] = await Promise.all([
        groupsApi.getById(id),
        expensesApi.getAll({ groupId: id }),
        groupsApi.getBalances(id),
      ]);
      setGroup(groupRes.data.group);
      setExpenses(expensesRes.data.expenses || []);
      setBalances(balancesRes.data.balances || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load group');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupData();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleExpenseAdded = () => {
    fetchGroupData();
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    try {
      setInviting(true);
      setInviteError('');
      const { data } = await groupsApi.addMember(id, inviteEmail.trim());
      setGroup(data.group);
      setInviteEmail('');
      setShowInvite(false);
    } catch (err) {
      setInviteError(err.response?.data?.error || 'Failed to add member');
    } finally {
      setInviting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader />
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="py-20 text-center">
        <p className="text-text-tertiary">{error || 'Group not found.'}</p>
        <button onClick={() => navigate('/groups')} className="mt-4 text-primary-500 text-[14px] hover:underline cursor-pointer">
          ← Back to Groups
        </button>
      </div>
    );
  }

  const members = group.members || [];
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Find current user's balance
  const myBalance = balances.find(
    (b) => b.id?.toString() === user?._id?.toString() || b._id?.toString() === user?._id?.toString()
  );
  const netBalance = myBalance?.balance ?? 0;

  return (
    <div className="w-full px-5 pt-6 pb-12">
      {/* Back nav */}
      <button
        onClick={() => navigate('/groups')}
        className="flex items-center gap-1.5 text-[13px] font-medium text-text-secondary hover:text-text-primary transition-colors mb-5 cursor-pointer"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        All groups
      </button>

      {/* Group header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-[26px]">
            💰
          </div>
          <div>
            <h1 className="text-[22px] font-bold text-text-primary tracking-tight">{group.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[12px] text-text-tertiary">{members.length} members</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => setShowInvite(true)}>+ Invite</Button>
          <Button size="sm" onClick={() => setShowAddExpense(true)}>+ Add Expense</Button>
        </div>
      </div>

      {/* Balance summary */}
      <div className="grid grid-cols-3 gap-3 mb-7">
        <div className="bg-surface-raised border border-border rounded-xl p-4 shadow-sm">
          <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider mb-1.5">Total Spent</p>
          <p className="text-[20px] font-bold text-text-primary">{formatCurrency(totalSpent)}</p>
        </div>
        <div className={`bg-surface-raised rounded-xl p-4 shadow-sm border ${netBalance < 0 ? 'border-danger-100' : netBalance > 0 ? 'border-success-200' : 'border-border'}`}>
          <p className={`text-[11px] font-semibold uppercase tracking-wider mb-1.5 ${netBalance < 0 ? 'text-danger-600' : netBalance > 0 ? 'text-success-600' : 'text-text-tertiary'}`}>
            {netBalance < 0 ? 'You Owe' : netBalance > 0 ? 'You Are Owed' : 'Net Balance'}
          </p>
          <p className={`text-[20px] font-bold ${netBalance < 0 ? 'text-danger-700' : netBalance > 0 ? 'text-success-700' : 'text-text-tertiary'}`}>
            {netBalance === 0 ? 'Settled' : formatCurrency(Math.abs(netBalance))}
          </p>
        </div>
        <div className="bg-surface-raised border border-border rounded-xl p-4 shadow-sm">
          <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider mb-1.5">Members</p>
          <p className="text-[20px] font-bold text-text-primary">{members.length}</p>
        </div>
      </div>

      {/* Balances */}
      {balances.length > 0 && (
        <div className="mb-7 bg-surface-raised border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-border/60 bg-surface-sunken">
            <h3 className="text-[13px] font-semibold text-text-secondary uppercase tracking-wider">Balances</h3>
          </div>
          {balances.map((b, i) => {
            const isMe = b.id?.toString() === user?._id?.toString() || b._id?.toString() === user?._id?.toString();
            return (
              <div
                key={i}
                className={`flex items-center justify-between px-5 py-3.5 ${i < balances.length - 1 ? 'border-b border-border/60' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <Avatar name={b.name} size="sm" />
                  <span className="text-[14px] text-text-primary font-medium">{isMe ? 'You' : b.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`text-[14px] font-semibold text-right min-w-[80px] ${b.balance > 0 ? 'text-success-600' : b.balance < 0 ? 'text-danger-600' : 'text-text-tertiary'}`}>
                    {b.balance > 0 ? '+' : ''}{formatCurrency(b.balance)}
                  </div>
                  {!isMe && b.balance > 0 && (
                    <Button 
                        size="xs" 
                        variant="ghost" 
                        className="text-primary-600 hover:bg-primary-50 px-2 py-1 rounded-lg font-bold"
                        onClick={() => navigate(`/pay?upi=${b.upiId}&amount=${Math.abs(b.balance)}&groupId=${id}`)}
                    >
                        Pay
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Expenses list */}
      <div>
        <h3 className="text-[15px] font-semibold text-text-primary px-0.5 mb-3">
          Expenses
          <span className="ml-2 text-[13px] font-normal text-text-tertiary">({expenses.length})</span>
        </h3>

        {expenses.length === 0 ? (
          <div className="py-10 text-center text-text-tertiary text-[14px]">No expenses yet. Add the first one!</div>
        ) : (
          <div className="bg-surface-raised rounded-xl border border-border shadow-sm overflow-hidden">
            {expenses.map((expense, index) => (
              <div
                key={expense._id}
                className={`flex items-center justify-between px-5 py-4 hover:bg-surface-sunken transition-all duration-200 cursor-pointer ${
                  index !== expenses.length - 1 ? 'border-b border-border/60' : ''
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Avatar name={expense.paidBy?.name || 'Unknown'} size="md" />
                  <div>
                    <p className="text-[14px] font-medium text-text-primary">{expense.title}</p>
                    <p className="text-[12px] text-text-secondary mt-0.5">
                      {expense.paidBy?.name || 'Unknown'} paid {formatCurrency(expense.amount)} ·{' '}
                      {new Date(expense.expenseDate || expense.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="text-[14px] font-semibold text-text-primary">{formatCurrency(expense.amount)}</p>
                  <p className="text-[11px] text-text-tertiary mt-0.5">{expense.category || 'general'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invite Modal */}
      <Modal
        open={showInvite}
        onClose={() => { setShowInvite(false); setInviteEmail(''); setInviteError(''); }}
        title="Invite member"
        maxWidth="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => { setShowInvite(false); setInviteEmail(''); setInviteError(''); }}>
              Cancel
            </Button>
            <Button onClick={handleInvite} disabled={!inviteEmail.trim()} loading={inviting}>
              Add Member
            </Button>
          </>
        }
      >
        <div className="py-2 space-y-3">
          <Input
            label="Email address"
            type="email"
            placeholder="friend@example.com"
            value={inviteEmail}
            onChange={(e) => { setInviteEmail(e.target.value); setInviteError(''); }}
            autoFocus
          />
          {inviteError && (
            <p className="text-[13px] text-danger-600">{inviteError}</p>
          )}
        </div>
      </Modal>

      <AddExpenseModal
        key={showAddExpense ? group._id : 'closed'}
        open={showAddExpense}
        onClose={() => { setShowAddExpense(false); handleExpenseAdded(); }}
        defaultGroup={group.name}
        groupId={group._id}
        groupMembers={members}
      />
    </div>
  );
}
