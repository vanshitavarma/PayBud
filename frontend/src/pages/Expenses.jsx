import { useState, useEffect } from 'react';
import { Card, Avatar, Badge, Input, Select, Button, Loader } from '@/components';
import { formatCurrency, timeAgo } from '@/utils';
import { expensesApi } from '@/api';

const categoryLabels = {
  food: 'Food',
  transport: 'Transport',
  groceries: 'Groceries',
  entertainment: 'Fun',
  bills: 'Bills',
  general: 'General',
};

const categoryColors = {
  food: 'accent',
  transport: 'primary',
  groceries: 'success',
  entertainment: 'warning',
  bills: 'danger',
  general: 'default',
};

export default function Expenses() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const params = {};
      if (categoryFilter) params.category = categoryFilter;
      const { data } = await expensesApi.getAll(params);
      setExpenses(data.expenses || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [categoryFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = expenses.filter((e) =>
    (e.title || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full px-5 pt-8 pb-12">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-[24px] font-bold text-text-primary tracking-tight">
            Expenses
          </h1>
          <p className="text-[14px] text-text-secondary mt-1">
            {expenses.length} total expenses
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-danger-50 border border-danger-200 rounded-lg text-danger-700 text-[13px]">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <Input
          placeholder="Search expenses…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          containerClassName="w-full sm:w-56"
        />
        <Select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          containerClassName="w-full sm:w-40"
          options={[
            { value: '', label: 'All categories' },
            { value: 'food', label: 'Food' },
            { value: 'transport', label: 'Transport' },
            { value: 'groceries', label: 'Groceries' },
            { value: 'entertainment', label: 'Entertainment' },
            { value: 'bills', label: 'Bills' },
            { value: 'general', label: 'General' },
          ]}
        />
      </div>

      {/* List */}
      {loading ? (
        <div className="py-16 flex justify-center"><Loader /></div>
      ) : (
        <div className="space-y-2">
          {filtered.map((expense) => (
            <Card
              key={expense._id}
              padding="compact"
              hoverable
              className="cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar name={expense.paidBy?.name || 'Unknown'} size="sm" />
                  <div>
                    <p className="text-[14px] font-medium text-text-primary leading-tight">
                      {expense.title}
                    </p>
                    <p className="text-[12px] text-text-tertiary">
                      {expense.paidBy?.name || 'Unknown'} paid ·{' '}
                      split {expense.splits?.length || 1} ways ·{' '}
                      {timeAgo(expense.expenseDate || expense.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <p className="text-[14px] font-semibold text-text-primary">
                    {formatCurrency(expense.amount)}
                  </p>
                  <Badge
                    variant={categoryColors[expense.category] || 'default'}
                    size="sm"
                  >
                    {categoryLabels[expense.category] || expense.category || 'General'}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}

          {filtered.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-text-tertiary text-[14px]">No expenses found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
