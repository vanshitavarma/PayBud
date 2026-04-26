import { useState, useEffect } from 'react';
import axios from '@/api/client';
import { Card, Button, Avatar } from '@/components';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [bankBalance, setBankBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [addingBalance, setAddingBalance] = useState(null); // userId
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
    }
    fetchAdminData();
  }, [user]);

  const fetchAdminData = async () => {
    try {
      const res = await axios.get('/admin/users');
      setUsers(res.data.users);
      setBankBalance(res.data.bankBalance);
    } catch (err) {
      console.error('Admin Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBalance = async (userId) => {
    if (!amount || parseFloat(amount) <= 0) return;
    try {
      await axios.post('/admin/add-balance', { userId, amount });
      setAmount('');
      setAddingBalance(null);
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add balance');
    }
  };

  if (loading) return <div className="p-8 text-center animate-pulse text-text-tertiary">Loading central bank systems...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header with Glassmorphism */}
      <div className="relative overflow-hidden rounded-[32px] p-8 md:p-12 text-white bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 shadow-2xl shadow-violet-200">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl border border-white/30">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="12" x="2" y="9" rx="2" />
                    <path d="M11 15h2" />
                    <path d="M15 15h2" />
                    <path d="M7 15h2" />
                    <path d="M2 9h20" />
                    <path d="M5 5h14" />
                    <path d="M8 2h8" />
                </svg>
            </div>
            <span className="text-sm font-semibold uppercase tracking-widest text-white/80">Central Reserve</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-3">System Bank</h1>
          <p className="text-white/80 text-lg md:text-xl font-medium max-w-xl leading-relaxed">
            Administrative overview of all user balances and central liquidity pool.
          </p>
          
          <div className="mt-8 inline-flex items-center gap-4 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-4 md:p-6 shadow-inner">
            <div className="space-y-1">
              <p className="text-xs font-bold text-white/70 uppercase tracking-tighter">Total Bank Liquidity</p>
              <p className="text-3xl md:text-4xl font-black tracking-tight">₹{bankBalance.toLocaleString()}</p>
            </div>
            <div className="h-12 w-px bg-white/20 mx-2 hidden md:block" />
            <div className="space-y-1 hidden md:block">
              <p className="text-xs font-bold text-white/70 uppercase tracking-tighter">Active Users</p>
              <p className="text-3xl font-black">{users.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 gap-6">
        <h3 className="text-xl font-bold text-text-primary px-1">User Ledger</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((u) => (
            <Card key={u._id} className="relative group overflow-hidden border-border/50 hover:border-primary-200 transition-all duration-300 hover:shadow-xl hover:shadow-primary-50/50">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar name={u.name} size="md" className="ring-2 ring-primary-50 group-hover:ring-primary-100 transition-all" />
                  <div className="min-w-0">
                    <p className="font-bold text-text-primary truncate">{u.name}</p>
                    <p className="text-xs text-text-tertiary truncate">{u.email}</p>
                    <p className="text-[10px] mt-1 inline-block px-2 py-0.5 bg-surface-sunken rounded-full text-text-secondary font-mono">
                        {u.upiId || 'No UPI ID'}
                    </p>
                  </div>
                </div>
                {u.role === 'admin' && (
                  <span className="px-2 py-1 bg-violet-100 text-violet-700 text-[10px] font-bold rounded-lg uppercase">Admin</span>
                )}
              </div>

              <div className="mt-6 p-4 bg-surface-sunken/50 rounded-2xl border border-border/40 group-hover:bg-primary-50/30 transition-colors">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-medium text-text-secondary">Balance</span>
                  <span className="text-xl font-black text-text-primary">
                    ₹{u.walletBalance.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border/40 flex gap-2">
                {addingBalance === u._id ? (
                  <div className="flex-1 flex gap-2 animate-in zoom-in-95 duration-200">
                    <input
                      type="number"
                      placeholder="Amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="flex-1 px-3 py-2 bg-surface-sunken border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary-500 transition-all"
                    />
                    <Button size="sm" onClick={() => handleAddBalance(u._id)}>Send</Button>
                    <Button size="sm" variant="ghost" onClick={() => setAddingBalance(null)}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full justify-center gap-2 text-xs font-bold border-dashed hover:border-solid transition-all"
                    onClick={() => setAddingBalance(u._id)}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Add Balance
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Transaction Log Placeholder / Recent Bank Activity */}
      <Card className="p-8 border-border/80 bg-surface-raised/50 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Bank Audit Log</h3>
            <span className="text-xs text-text-tertiary">Real-time tracking of central pool</span>
        </div>
        <div className="space-y-4">
            {/* Logic for history could go here */}
            <div className="p-4 rounded-2xl bg-surface-sunken/40 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="m17 5-5-3-5 3"/><path d="m17 19-5 3-5-3"/><rect width="14" height="10" x="5" y="7" rx="2"/></svg>
                    </div>
                    <div>
                        <p className="text-sm font-bold">System Initialization</p>
                        <p className="text-xs text-text-tertiary">Pool created with ₹1,000,000</p>
                    </div>
                </div>
                <p className="text-xs font-mono text-text-tertiary">Initial</p>
            </div>
            <p className="text-center py-4 text-xs text-text-tertiary italic">More audit logs will appear as transactions occur.</p>
        </div>
      </Card>
    </div>
  );
}
