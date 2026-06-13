<template>
  <div class="flipper-panel">
    <!-- Top Half: Net Progress Line Graph -->
    <div class="chart-section">
      <div class="panel-header">
        <h2 class="panel-title">📈 Net Progress Over Time</h2>
      </div>
      <NetChart :transactions="TRANSACTIONS" :currency="CURRENCY" />
    </div>

    <!-- Bottom Half: Stats -->
    <div class="stats-section">
      <div class="panel-header">
        <h2 class="panel-title">📊 Stats</h2>
      </div>
      <div class="stats-grid panel-scrollable">
        <!-- Stat Cards -->
        <div class="stat-card">
          <span class="stat-label">Most KOs</span>
          <span class="stat-value highlight">{{ stats.mostKOs.name }} ({{ stats.mostKOs.count }})</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Most Busted</span>
          <span class="stat-value">{{ stats.mostBustedName }} ({{ stats.mostBustedCount }})</span>
        </div>

        <!-- List Cards -->
        <!-- K/D -->
        <div class="list-card">
          <div class="list-title">Top 3 K/D Ratio</div>
          <div class="list-items">
            <div v-if="stats.top3KD[0]" class="list-item rank-1">
              {{ stats.top3KD[0].name }} ({{ stats.top3KD[0].k }}:{{ stats.top3KD[0].d }})
            </div>
            <div v-else class="list-item-placeholder">1st place</div>
            <div v-if="stats.top3KD[1]" class="list-item rank-2">
              {{ stats.top3KD[1].name }} ({{ stats.top3KD[1].k }}:{{ stats.top3KD[1].d }})
            </div>
            <div v-else class="list-item-placeholder">2nd place</div>
            <div v-if="stats.top3KD[2]" class="list-item rank-3">
              {{ stats.top3KD[2].name }} ({{ stats.top3KD[2].k }}:{{ stats.top3KD[2].d }})
            </div>
            <div v-else class="list-item-placeholder">3rd place</div>
          </div>
        </div>

        <!-- Rivalries -->
        <div class="list-card">
          <div class="list-title">Biggest Rivals</div>
          <div class="list-items">
            <div v-if="stats.topRivalries[0]" class="list-item rank-1 rivalry">
              <span class="rival-name">{{ stats.topRivalries[0].a }}</span>
              <span class="rivalry-vs">vs</span>
              <span class="rival-name">{{ stats.topRivalries[0].b }}</span>
              <span class="rivalry-kos">({{ stats.topRivalries[0].total }} KOs)</span>
            </div>
            <div v-else class="list-item-placeholder">—</div>
            <div v-if="stats.topRivalries[1]" class="list-item rank-2 rivalry">
              <span class="rival-name">{{ stats.topRivalries[1].a }}</span>
              <span class="rivalry-vs">vs</span>
              <span class="rival-name">{{ stats.topRivalries[1].b }}</span>
              <span class="rivalry-kos">({{ stats.topRivalries[1].total }} KOs)</span>
            </div>
            <div v-else class="list-item-placeholder">2nd place</div>
            <div v-if="stats.topRivalries[2]" class="list-item rank-3 rivalry">
              <span class="rival-name">{{ stats.topRivalries[2].a }}</span>
              <span class="rivalry-vs">vs</span>
              <span class="rival-name">{{ stats.topRivalries[2].b }}</span>
              <span class="rivalry-kos">({{ stats.topRivalries[2].total }} KOs)</span>
            </div>
            <div v-else class="list-item-placeholder">3rd place</div>
          </div>
        </div>


        <div class="stat-card">
          <span class="stat-label">All Time {{ CURRENCY }} on Table</span>
          <span class="stat-value">${{ stats.totalPot }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Poker Nights</span>
          <span class="stat-value">{{ stats.pokerNights }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Total Players</span>
          <span class="stat-value">{{ stats.totalPlayers }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Total KOs</span>
          <span class="stat-value">{{ stats.totalKOs }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { TRANSACTIONS, CURRENCY } from '../../config/leaderboard.js'
import { HOUSE_RULES } from '../../config/houseRules.js'
import NetChart from './NetChart.vue'

const rankedPlayers = computed(() => {
  const totals = {}
  for (const t of TRANSACTIONS) {
    if (!totals[t.name]) totals[t.name] = { name: t.name, buyIns: 0, payouts: 0 }
    if (t.type === 'buyin') totals[t.name].buyIns += t.amount
    else totals[t.name].payouts += t.amount
  }
  return Object.values(totals)
    .map(p => ({ ...p, net: p.payouts - p.buyIns }))
    .sort((a, b) => b.net - a.net)
})

const stats = computed(() => {
  const players = rankedPlayers.value

  // Eliminations from house rules (authored rules = someone was knocked out)
  const koCounts = {}
  const bustedCounts = {}
  const elimRules = HOUSE_RULES.filter(r => r.author && r.eliminatedPlayer)
  for (const r of elimRules) {
    koCounts[r.author] = (koCounts[r.author] || 0) + 1
    bustedCounts[r.eliminatedPlayer] = (bustedCounts[r.eliminatedPlayer] || 0) + 1
  }

  const mostKOEntry = Object.entries(koCounts).sort((a, b) => b[1] - a[1])[0]
  const mostBustedEntry = Object.entries(bustedCounts).sort((a, b) => b[1] - a[1])[0]

  const allElimPlayers = new Set([...Object.keys(koCounts), ...Object.keys(bustedCounts)])
  const kdList = Array.from(allElimPlayers).map(p => {
    const k = koCounts[p] || 0
    const d = bustedCounts[p] || 0
    const ratio = d === 0 ? k + 1000 : k / d
    return { name: p, k, d, ratio }
  }).sort((a, b) => b.ratio - a.ratio || b.k - a.k)
  const top3KD = kdList.slice(0, 3)

  const pairCounts = {}
  for (const r of elimRules) {
    const p1 = r.author
    const p2 = r.eliminatedPlayer
    if (!p1 || !p2 || p1 === p2) continue

    const [a, b] = [p1, p2].sort()
    const pairKey = `${a}|${b}`

    if (!pairCounts[pairKey]) {
      pairCounts[pairKey] = { a, b, total: 0, aKillsB: 0, bKillsA: 0 }
    }

    pairCounts[pairKey].total += 1
    if (p1 === a) pairCounts[pairKey].aKillsB += 1
    else pairCounts[pairKey].bKillsA += 1
  }
  const topRivalries = Object.values(pairCounts).sort((x, y) => y.total - x.total).slice(0, 3)

  const biggestWinner = players.reduce((best, p) => p.net > (best?.net ?? -Infinity) ? p : best, null)
  const totalPot = players.reduce((sum, p) => sum + p.buyIns, 0)
  const pokerNights = new Set(TRANSACTIONS.filter(t => t.amount > 0).map(t => t.date)).size
  const totalPlayers = players.length
  const totalKOs = elimRules.length

  return {
    top3KD,
    topRivalries,
    mostKOs: mostKOEntry ? { name: mostKOEntry[0], count: mostKOEntry[1] } : { name: '—', count: 0 },
    mostBustedName: mostBustedEntry ? mostBustedEntry[0] : '—',
    mostBustedCount: mostBustedEntry ? mostBustedEntry[1] : 0,
    biggestWinner: biggestWinner?.name ?? '—',
    biggestWin: biggestWinner?.net > 0 ? biggestWinner.net.toFixed(2) : '0.00',
    totalPot: totalPot.toFixed(2),
    pokerNights,
    totalPlayers,
    totalKOs,
  }
})
</script>

<style scoped>
.chart-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.chart-container {
  flex-grow: 1;
  min-height: 0;
}

.stats-section {
  flex: 2;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  flex-grow: 1;
  align-content: start;
  overflow-y: auto;
}

.stat-card {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 8px;
  padding: 0.4rem 0.6rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  grid-column: span 1;
}

.stat-label {
  font-size: 0.65rem;
  color: var(--textMuted, #7a9e7e);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  white-space: nowrap;
}

.stat-value {
  font-size: 0.9rem;
  font-weight: bold;
  color: var(--textPrimary, #f0e6c8);
  font-family: monospace;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stat-value.highlight {
  color: var(--highlight, #c9a84c);
}

.list-card {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 8px;
  padding: 0.45rem 0.6rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.list-title {
  font-size: 0.65rem;
  color: var(--textMuted, #7a9e7e);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  text-align: center;
  margin-bottom: 0.1rem;
}

.list-items {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  font-family: monospace;
  font-weight: bold;
}

.list-item {
  color: var(--textPrimary, #f0e6c8);
  text-align: center;
}

.list-item.rank-1 {
  font-size: 1rem;
  color: var(--highlight, #c9a84c);
}

.list-item.rank-2 {
  font-size: 0.85rem;
  opacity: 0.8;
}

.list-item.rank-3 {
  font-size: 0.75rem;
  opacity: 0.6;
}

.list-item.rivalry {
  text-transform: none;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.3rem;
}

.rivalry-vs {
  font-size: 0.7em;
  opacity: 0.6;
}

.rivalry-kos {
  font-size: 0.8em;
}

.list-item-placeholder {
  font-size: 0.8rem;
  color: var(--textMuted, #7a9e7e);
  opacity: 0.6;
  text-align: center;
}
</style>
