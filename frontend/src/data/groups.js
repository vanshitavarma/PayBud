// Shared group data — kept in own module so fast-refresh works in Groups.jsx
export const demoGroups = [
  {
    id: '1',
    name: 'Roommates',
    emoji: '🏠',
    members: [
      { id: 'a', name: 'Riya Sharma' },
      { id: 'b', name: 'Arjun Mehta' },
      { id: 'c', name: 'You' },
    ],
    balance: -340,
    totalSpend: 12400,
    lastActivity: '2 hours ago',
    expenses: [
      { id: 'e1', description: 'Dinner at Olive Garden', amount: 2400, paidBy: 'Riya Sharma', date: 'Today', yourShare: 800, type: 'owe' },
      { id: 'e2', description: 'Groceries — weekly', amount: 1560, paidBy: 'Arjun Mehta', date: 'Yesterday', yourShare: 520, type: 'owe' },
      { id: 'e3', description: 'Electricity Bill — March', amount: 3200, paidBy: 'You', date: '3 days ago', yourShare: 1066, type: 'owed' },
      { id: 'e4', description: 'Netflix subscription', amount: 649, paidBy: 'You', date: 'Last week', yourShare: 216, type: 'owed' },
    ],
    balances: [
      { person: 'Riya Sharma', amount: -240, direction: 'owe' },
      { person: 'Arjun Mehta', amount: -100, direction: 'owe' },
    ],
  },
  {
    id: '2',
    name: 'Trip — Goa',
    emoji: '🏖️',
    members: [
      { id: 'a', name: 'Riya Sharma' },
      { id: 'd', name: 'Priya Patel' },
      { id: 'e', name: 'Vikram Singh' },
      { id: 'c', name: 'You' },
    ],
    balance: 1200,
    totalSpend: 28560,
    lastActivity: 'Yesterday',
    expenses: [
      { id: 'e5', description: 'Flight tickets', amount: 14000, paidBy: 'Priya Patel', date: '5 days ago', yourShare: 3500, type: 'owe' },
      { id: 'e6', description: 'Hotel — 3 nights', amount: 8400, paidBy: 'You', date: '5 days ago', yourShare: 2100, type: 'owed' },
      { id: 'e7', description: 'Uber to airport', amount: 890, paidBy: 'You', date: 'Yesterday', yourShare: 222, type: 'owed' },
      { id: 'e8', description: 'Movie tickets — Dune 3', amount: 720, paidBy: 'Vikram Singh', date: '2 days ago', yourShare: 180, type: 'owe' },
    ],
    balances: [
      { person: 'Priya Patel', amount: 800, direction: 'owed' },
      { person: 'Vikram Singh', amount: 400, direction: 'owed' },
    ],
  },
  {
    id: '3',
    name: 'Office Lunch',
    emoji: '🍱',
    members: [
      { id: 'f', name: 'Neha Gupta' },
      { id: 'g', name: 'Kunal Das' },
      { id: 'c', name: 'You' },
    ],
    balance: 0,
    totalSpend: 3400,
    lastActivity: '3 days ago',
    expenses: [
      { id: 'e9', description: 'Lunch — Biryani House', amount: 840, paidBy: 'Neha Gupta', date: '3 days ago', yourShare: 280, type: 'settled' },
      { id: 'e10', description: 'Coffee run', amount: 360, paidBy: 'You', date: 'Last week', yourShare: 120, type: 'settled' },
    ],
    balances: [],
  },
];
