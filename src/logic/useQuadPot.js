import { computed } from 'vue';
import { TRANSACTIONS } from '../config/leaderboard.js';

export function useQuadPot() {
  const quadPotValue = computed(() => {
    const totalIn = TRANSACTIONS.filter(t => t.type === 'buyin').reduce((s, t) => s + t.amount, 0);
    const totalOut = TRANSACTIONS.filter(t => t.type === 'payout').reduce((s, t) => s + t.amount, 0);
    return (totalIn - totalOut).toFixed(2);
  });

  return { quadPotValue };
}
