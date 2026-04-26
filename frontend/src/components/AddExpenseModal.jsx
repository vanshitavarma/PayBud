import { useState } from 'react';
import { Modal, Button, Input, Select } from '@/components';
import { expensesApi } from '@/api';
import { useSelector } from 'react-redux';

export default function AddExpenseModal({ open, onClose, defaultGroup = '', groupId = null, groupMembers = [] }) {
  const user = useSelector((s) => s.auth.user);
  const groups = useSelector((s) => s.groups.groups);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const [form, setForm] = useState({
    title: '',
    amount: '',
    category: 'general',
    splitType: 'equal',
    notes: '',
  });
  const [errors, setErrors] = useState({});

  // Determine effective groupId
  const effectiveGroupId = groupId || groups.find(g => g.name === defaultGroup)?._id;

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'What was this expense for?';
    if (!form.amount || parseFloat(form.amount) <= 0) newErrors.amount = 'Enter a valid amount';
    if (!effectiveGroupId) newErrors.group = 'No group selected';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setSubmitting(true);
      setApiError('');
      const amount = parseFloat(form.amount);
      
      // Build equal splits across all group members
      const memberIds = groupMembers.length > 0
        ? groupMembers.map(m => m._id || m)
        : [user?._id];
      
      const splitAmount = +(amount / memberIds.length).toFixed(2);
      const splits = memberIds.map(userId => ({ userId, amount: splitAmount }));

      await expensesApi.create({
        groupId: effectiveGroupId,
        title: form.title,
        amount,
        category: form.category,
        splitType: form.splitType,
        splits,
        notes: form.notes,
        date: new Date().toISOString(),
      });

      setForm({ title: '', amount: '', category: 'general', splitType: 'equal', notes: '' });
      setErrors({});
      onClose();
    } catch (err) {
      setApiError(err.response?.data?.error || err.response?.data?.message || 'Failed to add expense');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    setApiError('');
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Add an expense"
      maxWidth="md"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} loading={submitting}>Add Expense</Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        {apiError && (
          <div className="p-3 bg-danger-50 border border-danger-200 rounded-lg text-danger-700 text-[13px]">
            {apiError}
          </div>
        )}

        <Input
          label="Description"
          placeholder="e.g. Dinner at Olive Garden"
          value={form.title}
          onChange={(e) => {
            setForm({ ...form, title: e.target.value });
            if (errors.title) setErrors({ ...errors, title: null });
          }}
          error={errors.title}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Amount (₹)"
            type="number"
            placeholder="0.00"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={(e) => {
              setForm({ ...form, amount: e.target.value });
              if (errors.amount) setErrors({ ...errors, amount: null });
            }}
            error={errors.amount}
          />
          <Select
            label="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            options={[
              { value: 'general', label: 'General' },
              { value: 'food', label: 'Food' },
              { value: 'transport', label: 'Transport' },
              { value: 'groceries', label: 'Groceries' },
              { value: 'entertainment', label: 'Entertainment' },
              { value: 'bills', label: 'Bills' },
            ]}
          />
        </div>

        {defaultGroup && (
          <div className="text-[13px] text-text-secondary bg-surface-sunken rounded-lg px-3 py-2 border border-border">
            Group: <span className="font-semibold text-text-primary">{defaultGroup}</span>
            {groupMembers.length > 0 && (
              <span className="ml-2 text-text-tertiary">· Split among {groupMembers.length} members</span>
            )}
          </div>
        )}

        {errors.group && (
          <p className="text-[13px] text-danger-600">{errors.group}</p>
        )}

        <div>
          <label className="block text-[13px] font-medium text-text-secondary mb-2">Split type</label>
          <div className="flex gap-2">
            {[
              { value: 'equal', label: 'Equal' },
              { value: 'exact', label: 'Exact' },
              { value: 'percent', label: 'By %' },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setForm({ ...form, splitType: opt.value })}
                className={`flex-1 py-1.5 px-3 text-[13px] font-medium rounded-md border transition-all duration-200 cursor-pointer active:scale-[0.98] ${
                  form.splitType === opt.value
                    ? 'bg-primary-500 text-white border-primary-500 shadow-sm'
                    : 'bg-surface border-border text-text-secondary hover:border-border-strong hover:text-text-primary hover:bg-surface-sunken'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <Input
          label="Notes (optional)"
          placeholder="Any notes about this expense"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
      </form>
    </Modal>
  );
}
