import { useState, useEffect } from 'react';
import { Card, Avatar, Badge, Button, Loader } from '@/components';
import { formatCurrency } from '@/utils';
import { paymentsApi } from '@/api';
import { useSelector } from 'react-redux';

export default function Settle() {
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState({ paid: 0, owe: 0 });
  const [loading, setLoading] = useState(true);
  const [settling, setSettling] = useState(null);
  const [error, setError] = useState('');
  const user = useSelector((s) => s.auth.user);

  const loadData = async () => {
    try {
      setLoading(true);
      const [txRes, balRes] = await Promise.all([
        paymentsApi.getHistory(),
        paymentsApi.getBalance(),
      ]);
      setTransactions(txRes.data.transactions || []);
      setBalance(balRes.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load settlements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSettle = async (tx) => {
    try {
      setSettling(tx._id);
      await paymentsApi.settle({
        payeeId: tx.payee?._id || tx.payee,
        amount: tx.amount,
        method: 'wallet',
      });
      await loadData();
    } catch (err) {
      setError(err.response?.data?.error || 'Settlement failed');
    } finally {
      setSettling(null);
    }
  };

  const totalOwe = Math.max(balance.owe - balance.paid, 0);
  const totalOwed = Math.max(balance.paid - balance.owe, 0);

  return (
    <div className="w-full px-5 pt-6 pb-12">
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold text-text-primary">Settle Up</h1>
        <p className="text-[13px] text-text-secondary mt-0.5">Your payment history</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-danger-50 border border-danger-200 rounded-lg text-danger-700 text-[13px]">
          {error}
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 mb-7">
        <Card padding="default">
          <p className="text-[12px] text-text-tertiary uppercase tracking-wide mb-1">You owe</p>
          <p className="text-[20px] font-semibold text-danger-600">{formatCurrency(totalOwe)}</p>
        </Card>
        <Card padding="default">
          <p className="text-[12px] text-text-tertiary uppercase tracking-wide mb-1">You are owed</p>
          <p className="text-[20px] font-semibold text-success-600">{formatCurrency(totalOwed)}</p>
        </Card>
      </div>

      <h2 className="text-[15px] font-semibold text-text-primary mb-3">Transaction History</h2>

      {loading ? (
        <div className="py-16 flex justify-center"><Loader /></div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-12 text-text-tertiary text-[14px]">No transactions yet</div>
      ) : (
        <div className="space-y-2">
          {transactions.map((tx) => {
            const isOut = tx.payer?._id === user?._id || tx.payer === user?._id;
            return (
              <Card key={tx._id} padding="default">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center -space-x-1">
                      <Avatar name={tx.payer?.name || 'Unknown'} size="sm" />
                      <div className="w-5 h-5 rounded-full bg-surface-raised border border-border flex items-center justify-center z-10">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </div>
                      <Avatar name={tx.payee?.name || 'Unknown'} size="sm" />
                    </div>
                    <div>
                      <p className="text-[14px] text-text-primary">
                        <span className="font-medium">{isOut ? 'You' : tx.payer?.name}</span>
                        {' → '}
                        <span className="font-medium">{isOut ? tx.payee?.name : 'You'}</span>
                      </p>
                      <p className="text-[12px] text-text-tertiary">
                        {new Date(tx.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {' · '}{tx.paymentMethod}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className={`text-[15px] font-semibold ${isOut ? 'text-danger-600' : 'text-success-600'}`}>
                      {formatCurrency(tx.amount)}
                    </p>
                    <Badge variant={tx.status === 'completed' ? 'success' : 'default'} size="sm">
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
