<template>
  <div class="flipper-panel">
    <div class="panel-header">
      <h2 class="panel-title">🏆 Leaderboard</h2>
    </div>
    <div class="leaderboard-container">
      <LeaderboardList
        title="Total Earnings"
        :items="rankedByNet"
        valueLabel="Net"
        :formatValue="formatCurrency"
      />
      <div class="divider"></div>
      <LeaderboardList
        title="Return on Investment (ROI)"
        :items="rankedByRoi"
        valueLabel="ROI"
        :formatValue="formatRoi"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { TRANSACTIONS, CURRENCY } from '../../config/leaderboard.js'
import LeaderboardList from '../LeaderboardList.vue'

const playerStats = computed(() => {
  const totals = {}
  for (const t of TRANSACTIONS) {
    if (!totals[t.name]) totals[t.name] = { name: t.name, buyIns: 0, payouts: 0 }
    if (t.type === 'buyin') totals[t.name].buyIns += t.amount
    else totals[t.name].payouts += t.amount
  }
  return Object.values(totals).map(p => {
    const net = p.payouts - p.buyIns
    const roi = p.buyIns > 0 ? (net / p.buyIns) * 100 : 0
    return { ...p, net, roi, value: net } // Default value for sorting
  })
})

const rankedByNet = computed(() => {
  return [...playerStats.value]
    .sort((a, b) => b.net - a.net)
    .map(p => ({ name: p.name, value: p.net }))
})

const rankedByRoi = computed(() => {
  return [...playerStats.value]
    .sort((a, b) => b.roi - a.roi)
    .map(p => ({ name: p.name, value: p.roi }))
})

const formatCurrency = (value) => {
  return `${value >= 0 ? '+' : ''}${CURRENCY}${value.toFixed(2)}`
}

const formatRoi = (value) => {
  return `${value.toFixed(1)}%`
}
</script>

<style scoped>
.leaderboard-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 0;
}
.divider {
  height: 1px;
  background-color: var(--borderSubtle);
  margin: clamp(0.2rem, 1vh, 0.5rem) 0;
}
</style>
