// Leaderboard config
// type: 'buyin' (money going in) or 'payout' (money coming out)
// amount: dollar amount
// date: string date of the transaction

export const TRANSACTIONS = [
  // zero out balances before starting to track
  { name: 'Trevor',  type: 'buyin',  amount: 0.00, date: '2026-05-01' },
  // 2026-05-22 transactions
  { name: 'Trevor',  type: 'buyin',  amount: 20.00, date: '2026-05-22' },
  { name: 'Eric',    type: 'buyin',  amount: 20.00, date: '2026-05-22' },
  { name: 'Mark',    type: 'buyin',  amount: 20.00, date: '2026-05-22' },
  { name: 'Darnell', type: 'buyin',  amount: 20.00, date: '2026-05-22' },
  { name: 'Cole',    type: 'buyin',  amount: 20.00, date: '2026-05-22' },
  { name: 'Mark',    type: 'buyin',  amount: 20.00, date: '2026-05-22' },
  { name: 'Trevor',  type: 'payout', amount: 25.90, date: '2026-05-22' },
  { name: 'Trevor',  type: 'payout', amount: 5.60,  date: '2026-05-22', quad: true },
  { name: 'Eric',    type: 'payout', amount: 3.00,  date: '2026-05-22' },
  { name: 'Darnell', type: 'payout', amount: 21.70, date: '2026-05-22' },
  { name: 'Cole',    type: 'payout', amount: 32.20, date: '2026-05-22' },
  { name: 'Mark',    type: 'payout', amount: 16.60, date: '2026-05-22' },

  // 2026-05-22 transactions
  // { name: 'Trevor',  type: 'buyin',  amount: 20.00, date: '2026-05-23' },
  // { name: 'Eric',    type: 'buyin',  amount: 20.00, date: '2026-05-23' },
  // { name: 'Mark',    type: 'buyin',  amount: 20.00, date: '2026-05-23' },
  // { name: 'Issac', type: 'buyin',  amount: 20.00, date: '2026-05-23' },
  // { name: 'Cole',    type: 'buyin',  amount: 20.00, date: '2026-05-23' },
  // { name: 'Mark',    type: 'buyin',  amount: 20.00, date: '2026-05-23' },
  // { name: 'Trevor',  type: 'payout', amount: 25.85, date: '2026-05-23' },
  // { name: 'Eric',    type: 'payout', amount: 3.00,  date: '2026-05-23' },
  // { name: 'Issac', type: 'payout', amount: 21.75, date: '2026-05-23' },
  // { name: 'Cole',    type: 'payout', amount: 32.20, date: '2026-05-23' },
  // { name: 'Mark',    type: 'payout', amount: 16.60, date: '2026-05-23' },
  // // 2026-05-22 transactions
  // { name: 'Trevor',  type: 'buyin',  amount: 20.00, date: '2026-05-24' },
  // { name: 'Eric',    type: 'buyin',  amount: 20.00, date: '2026-05-24' },
  // { name: 'Mark',    type: 'buyin',  amount: 20.00, date: '2026-05-24' },
  // { name: 'Issac', type: 'buyin',  amount: 20.00, date: '2026-05-24' },
  // { name: 'Cole',    type: 'buyin',  amount: 20.00, date: '2026-05-24' },
  // { name: 'Mark',    type: 'buyin',  amount: 20.00, date: '2026-05-24' },
  // { name: 'Trevor',  type: 'payout', amount: 25.85, date: '2026-05-24' },
  // { name: 'Eric',    type: 'payout', amount: 3.00,  date: '2026-05-24' },
  // { name: 'Issac', type: 'payout', amount: 21.75, date: '2026-05-24' },
  // { name: 'Cole',    type: 'payout', amount: 32.20, date: '2026-05-24' },
  // { name: 'Mark',    type: 'payout', amount: 16.60, date: '2026-05-24' },
  // // 2026-05-22 transactions
  // { name: 'Trevor',  type: 'buyin',  amount: 20.00, date: '2026-05-25' },
  // { name: 'Eric',    type: 'buyin',  amount: 20.00, date: '2026-05-25' },
  // { name: 'Joe',    type: 'buyin',  amount: 20.00, date: '2026-05-25' },
  // { name: 'Issac', type: 'buyin',  amount: 20.00, date: '2026-05-25' },
  // { name: 'Cole',    type: 'buyin',  amount: 20.00, date: '2026-05-25' },
  // { name: 'Joe',    type: 'buyin',  amount: 20.00, date: '2026-05-25' },
  // { name: 'Trevor',  type: 'payout', amount: 25.85, date: '2026-05-25' },
  // { name: 'Eric',    type: 'payout', amount: 3.00,  date: '2026-05-25' },
  // { name: 'Issac', type: 'payout', amount: 21.75, date: '2026-05-25' },
  // { name: 'Cole',    type: 'payout', amount: 32.20, date: '2026-05-25' },
  // { name: 'Joe',    type: 'payout', amount: 16.60, date: '2026-05-25' },
  // // 2026-05-22 transactions
  // { name: 'Trevor',  type: 'buyin',  amount: 20.00, date: '2026-05-26' },
  // { name: 'Steve',    type: 'buyin',  amount: 20.00, date: '2026-05-26' },
  // { name: 'Joe',    type: 'buyin',  amount: 20.00, date: '2026-05-26' },
  // { name: 'Issac', type: 'buyin',  amount: 20.00, date: '2026-05-26' },
  // { name: 'Cole',    type: 'buyin',  amount: 20.00, date: '2026-05-26' },
  // { name: 'Joe',    type: 'buyin',  amount: 20.00, date: '2026-05-26' },
  // { name: 'Trevor',  type: 'payout', amount: 25.85, date: '2026-05-26' },
  // { name: 'Steve',    type: 'payout', amount: 3.00,  date: '2026-05-26' },
  // { name: 'Issac', type: 'payout', amount: 21.75, date: '2026-05-26' },
  // { name: 'Cole',    type: 'payout', amount: 32.20, date: '2026-05-26' },
  // { name: 'Joe',    type: 'payout', amount: 16.60, date: '2026-05-26' },
]

// Currency symbol to display
export const CURRENCY = '$'
