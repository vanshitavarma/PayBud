/**
 * Shared currency formatter (works in Node & browser via bundler)
 */
exports.formatCurrency = (amount, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency, minimumFractionDigits: 2 }).format(amount);

/**
 * Simplify debts — minimize transactions in a group
 */
exports.simplifyDebts = (balances) => {
  const debtors = balances.filter(b => b.balance < 0).map(b => ({ ...b, balance: -b.balance }));
  const creditors = balances.filter(b => b.balance > 0);
  const txns = [];
  let i = 0, j = 0;
  while (i < debtors.length && j < creditors.length) {
    const amt = Math.min(debtors[i].balance, creditors[j].balance);
    txns.push({ from: debtors[i].id, to: creditors[j].id, amount: parseFloat(amt.toFixed(2)) });
    debtors[i].balance -= amt;
    creditors[j].balance -= amt;
    if (debtors[i].balance === 0) i++;
    if (creditors[j].balance === 0) j++;
  }
  return txns;
};
