import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Loader } from '@/components';
import { formatCurrency } from '@/utils';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useAuth } from '@/hooks/useAuth';
import { useGroups } from '@/hooks/useGroups';
import { paymentsApi } from '@/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const { isDark, toggle: toggleDarkMode } = useDarkMode();
  const { user } = useAuth();
  const { groups, fetchGroups, loading: groupsLoading } = useGroups();
  const [balance, setBalance] = useState({ paid: 0, owe: 0, balance: 0 });
  const [transactions, setTransactions] = useState([]);
  const [txLoading, setTxLoading] = useState(false);
  const [showWalletBalance, setShowWalletBalance] = useState(true);

  const firstName = user?.name?.split(' ')[0] || 'there';

  useEffect(() => {
    fetchGroups();
    loadBalance();
    loadTransactions();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadBalance = async () => {
    try {
      const { data } = await paymentsApi.getBalance();
      setBalance(data);
    } catch (e) {
      console.error('Balance load error', e);
    }
  };

  const loadTransactions = async () => {
    try {
      setTxLoading(true);
      const { data } = await paymentsApi.getHistory();
      setTransactions(data.transactions || []);
    } catch (e) {
      console.error('Transaction load error', e);
    } finally {
      setTxLoading(false);
    }
  };

  const recentGroups = groups.slice(0, 3);
  const recentTxs = transactions.slice(0, 4);

  return (
    <div className="min-h-screen bg-surface flex flex-col md:pt-8 pt-6 overflow-hidden md:px-8">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden px-5 flex items-center justify-between mb-4 mt-2">
        <div className="bg-surface-sunken border border-border px-3 py-1.5 rounded-full flex items-center gap-2 cursor-pointer shadow-sm active:scale-95 transition-transform" onClick={() => navigate('/profile')}>
          <Avatar name={user?.name || 'User'} size="xs" />
          <span className="text-[13px] font-semibold text-text-primary pr-1">{firstName}</span>
        </div>
        <div className="flex gap-3">
          <button onClick={toggleDarkMode} className="w-10 h-10 rounded-full bg-surface-raised border border-border flex items-center justify-center text-text-primary shadow-sm hover:shadow-md active:scale-95 transition-all outline-none">
            {isDark ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Desktop Top Bar */}
      <div className="hidden md:flex items-center justify-between mb-10 w-full">
        <div>
          <h1 className="text-[28px] font-bold text-text-primary tracking-tight leading-tight">
            Welcome, {firstName}.
          </h1>
        </div>
        <div className="flex items-center gap-5">
          <div className="relative w-64">
            <input 
              type="text" 
              placeholder="Search..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface-sunken border border-border pl-10 pr-4 py-2.5 rounded-full text-[14px] text-text-primary focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400 transition-all placeholder:text-text-tertiary shadow-sm"
            />
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <button onClick={toggleDarkMode} className="w-10 h-10 rounded-full bg-surface-raised border border-border flex items-center justify-center text-text-primary shadow-sm transition-all cursor-pointer outline-none">
            {isDark ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
              </svg>
            )}
          </button>
          <div className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate('/profile')}>
            <Avatar name={user?.name || 'User'} size="md" />
          </div>
        </div>
      </div>

      <div className="md:hidden px-5 mb-5">
        <h1 className="text-[26px] font-bold text-text-primary tracking-tight leading-tight">Welcome,</h1>
        <h2 className="text-[26px] font-medium text-text-secondary tracking-tight">{firstName}.</h2>
      </div>

      <div className="flex flex-col md:flex-row gap-6 md:gap-10">
        
        {/* LEFT COLUMN */}
        <div className="w-full md:flex-[1.5]">
          
          {/* Quick Actions */}
          <div className="px-5 md:px-0 mb-6 md:mb-10 w-full">
            <div className="bg-gradient-to-br from-[#1E3A5F] to-[#184b62] rounded-[28px] md:rounded-[24px] p-6 shadow-lg relative overflow-hidden">
              <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-[#2E86AB] rounded-full blur-[40px] opacity-40"></div>
              <div className="absolute bottom-[-20%] left-[-10%] w-40 h-40 bg-[#4da9cc] rounded-full blur-[40px] opacity-30"></div>
              
              <div className="relative z-10 grid grid-cols-4 md:grid-cols-4 gap-y-6 md:gap-x-4">
                <button onClick={() => navigate('/pay')} className="flex flex-col items-center gap-2 outline-none group cursor-pointer">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/10 flex items-center justify-center text-white border border-white/20 group-hover:bg-white/20 group-active:scale-95 transition-all shadow-sm">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 2 11 13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </div>
                  <span className="text-[12px] md:text-[13px] font-semibold text-white/90">Pay</span>
                </button>

                <button onClick={() => navigate('/groups')} className="flex flex-col items-center gap-2 outline-none group cursor-pointer">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/10 flex items-center justify-center text-white border border-white/20 group-hover:bg-white/20 group-active:scale-95 transition-all shadow-sm">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  </div>
                  <span className="text-[12px] md:text-[13px] font-semibold text-white/90">Groups</span>
                </button>

                <button onClick={() => navigate('/expenses')} className="flex flex-col items-center gap-2 outline-none group cursor-pointer">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/10 flex items-center justify-center text-white border border-white/20 group-hover:bg-white/20 group-active:scale-95 transition-all shadow-sm">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="14" x="2" y="5" rx="2" /><path d="M2 10h20" />
                    </svg>
                  </div>
                  <span className="text-[12px] md:text-[13px] font-semibold text-white/90">Expenses</span>
                </button>

                <button onClick={() => navigate('/settle')} className="flex flex-col items-center gap-2 outline-none group cursor-pointer">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/10 flex items-center justify-center text-white border border-white/20 group-hover:bg-white/20 group-active:scale-95 transition-all shadow-sm">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                    </svg>
                  </div>
                  <span className="text-[12px] md:text-[13px] font-semibold text-white/90">Settle</span>
                </button>
              </div>
            </div>
          </div>

          {/* Balance Summary */}
          <div className="hidden md:flex gap-5 mb-10 w-full">
            <div className="flex-1 bg-surface-raised border border-success-200 rounded-2xl p-5 shadow-sm">
              <p className="text-[13px] font-semibold text-success-700 uppercase tracking-wider mb-2">You are owed</p>
              <p className="text-[28px] font-bold text-success-700">
                {showWalletBalance ? formatCurrency(balance.paid - balance.owe > 0 ? balance.paid - balance.owe : 0) : '••••'}
              </p>
            </div>
            <div className="flex-[0.8] bg-surface-raised border border-danger-100 rounded-2xl p-5 shadow-sm">
              <p className="text-[13px] font-semibold text-danger-700 uppercase tracking-wider mb-2">You owe</p>
              <p className="text-[28px] font-bold text-danger-800">
                {showWalletBalance ? formatCurrency(balance.owe - balance.paid > 0 ? balance.owe - balance.paid : 0) : '••••'}
              </p>
            </div>
          </div>

          {/* Wallet Balance Card */}
          <div className="px-5 md:px-0 mb-8 md:mb-10 w-full">
            <div className="bg-surface-raised border border-border shadow-sm rounded-2xl p-4 md:p-5 flex items-center justify-between hover:shadow-md hover:-translate-y-[1px] active:scale-[0.99] transition-all cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-primary-50 rounded-full flex items-center justify-center text-primary-600">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" x2="12" y1="2" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <div>
                  <p className="text-[14px] md:text-[15px] font-semibold text-text-primary leading-tight">PaySplit Wallet</p>
                  <p className="text-[12px] md:text-[13px] text-text-secondary mt-0.5">{user?.upiId || 'UPI not set'}</p>
                </div>
              </div>
              <div className="text-right flex flex-col items-end">
                <div className="flex items-center gap-2">
                    <p className="text-[16px] font-bold text-text-primary">
                        {showWalletBalance ? formatCurrency(user?.walletBalance ?? 0) : '••••••'}
                    </p>
                    <button 
                        onClick={(e) => { e.stopPropagation(); setShowWalletBalance(!showWalletBalance); }}
                        className="text-text-tertiary hover:text-text-secondary transition-colors"
                    >
                        {showWalletBalance ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z"/><circle cx="12" cy="12" r="3"/></svg>
                        ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                        )}
                    </button>
                </div>
                <p className="text-[12px] text-text-tertiary">wallet balance</p>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="px-5 md:px-0 mb-8 w-full">
            <div className="flex items-center justify-between mb-4 md:mb-5">
              <h3 className="text-[15px] md:text-[18px] font-semibold text-text-primary tracking-tight">Recent Activity</h3>
              <button onClick={() => navigate('/expenses')} className="text-[13px] md:text-[14px] font-medium text-primary-600 hover:text-primary-700 transition-all outline-none cursor-pointer">
                View History
              </button>
            </div>
            
            {txLoading ? (
              <div className="py-8 flex justify-center"><Loader /></div>
            ) : recentTxs.length === 0 ? (
              <div className="py-8 text-center text-text-tertiary text-[14px]">No recent transactions</div>
            ) : (
              <div className="flex flex-col gap-1 w-full">
                {recentTxs.map((tx) => {
                  const isOut = tx.payer?._id === user?._id || tx.payer === user?._id;
                  return (
                    <div key={tx._id} className="flex items-center justify-between py-3 md:py-4 px-4 md:px-5 bg-surface-raised border border-border rounded-2xl hover:bg-surface-sunken hover:shadow-sm transition-all cursor-pointer group">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 bg-surface-sunken rounded-full flex items-center justify-center text-text-tertiary border border-border group-hover:scale-105 transition-transform">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-[14.5px] md:text-[15.5px] font-medium text-text-primary leading-tight">
                            {isOut ? tx.payee?.name || 'Unknown' : tx.payer?.name || 'Unknown'}
                          </p>
                          <p className="text-[12px] md:text-[13px] text-text-tertiary mt-0.5">
                            {new Date(tx.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-[15px] md:text-[16.5px] font-bold tracking-tight ${isOut ? 'text-text-primary' : 'text-success-700'}`}>
                          {isOut ? '' : '+'}{formatCurrency(tx.amount)}
                        </p>
                        <p className="text-[11.5px] md:text-[12.5px] font-medium mt-0.5 text-text-secondary">
                          {tx.status}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="w-full md:flex-1 md:max-w-[400px]">
          
          {/* Active Groups */}
          <div className="mb-8 px-5 md:px-0 w-full">
            <div className="flex items-center justify-between mb-4 md:mb-5">
              <h3 className="text-[15px] md:text-[18px] font-semibold text-text-primary tracking-tight">Active Groups</h3>
              <button onClick={() => navigate('/groups')} className="text-[13px] md:text-[14px] font-medium text-primary-600 hover:text-primary-700 transition-all outline-none cursor-pointer">
                View all
              </button>
            </div>
            {groupsLoading ? (
              <div className="py-8 flex justify-center"><Loader /></div>
            ) : recentGroups.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-text-tertiary text-[14px] mb-3">No groups yet</p>
                <button onClick={() => navigate('/groups')} className="text-primary-500 text-[13px] font-medium">
                  Create your first group →
                </button>
              </div>
            ) : (
              <div className="space-y-3 md:bg-surface-raised md:p-1 md:rounded-3xl md:border md:border-border/60">
                {recentGroups.map((group) => (
                  <button
                    key={group._id}
                    onClick={() => navigate(`/groups/${group._id}`)}
                    className="w-full md:bg-transparent bg-surface-raised rounded-xl md:rounded-2xl px-4 py-3 md:py-4 border md:border-transparent border-border shadow-[0_1px_3px_rgba(0,0,0,0.02)] md:shadow-none md:hover:bg-surface-sunken flex items-center justify-between active:scale-[0.98] md:hover:-translate-y-0.5 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5 md:gap-4">
                      <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-surface-sunken border border-border/50 flex items-center justify-center text-[18px] md:text-[20px]">
                        💰
                      </div>
                      <div className="text-left">
                        <p className="text-[14px] md:text-[15px] font-semibold text-text-primary leading-tight mb-0.5 md:mb-1">{group.name}</p>
                        <p className="text-[12px] md:text-[13px] text-text-secondary">
                          {group.member_count || group.members?.length || 0} members
                        </p>
                      </div>
                    </div>
                    <svg className="text-text-tertiary" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>
                ))}
              </div>
            )}
          </div>
          
        </div>
      </div>
      
    </div>
  );
}
