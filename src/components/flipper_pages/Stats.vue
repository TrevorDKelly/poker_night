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
        <div class="card stat-card">
          <span class="card-title">Most KOs</span>
          <span class="card-value highlight">{{ stats.mostKOs.name }} ({{ stats.mostKOs.count }})</span>
        </div>
        <div class="card stat-card">
          <span class="card-title">Most Busted</span>
          <span class="card-value">{{ stats.mostBustedName }} ({{ stats.mostBustedCount }})</span>
        </div>

        <!-- List Cards -->
        <!-- K/D -->
        <div class="card list-card">
          <div class="card-title">Top 3 K/D Ratio</div>
          <div class="card-value list-items">
            <div class="list-column rank-col">
              <span class="rank-label rank-1">1st</span>
              <span class="rank-label rank-2">2nd</span>
              <span class="rank-label rank-3">3rd</span>
            </div>
            <div class="list-column">
              <span v-if="stats.top3KD[0]" class="rank-1">{{ stats.top3KD[0].name }}</span>
              <span v-else class="list-item-placeholder">1st place</span>
              <span v-if="stats.top3KD[1]" class="rank-2">{{ stats.top3KD[1].name }}</span>
              <span v-else class="list-item-placeholder">2nd place</span>
              <span v-if="stats.top3KD[2]" class="rank-3">{{ stats.top3KD[2].name }}</span>
              <span v-else class="list-item-placeholder">3rd place</span>
            </div>
            <div class="list-column">
              <span v-if="stats.top3KD[0]" class="rank-1">{{ stats.top3KD[0].k }}:{{ stats.top3KD[0].d }}</span>
              <span v-else class="list-item-placeholder"></span>
              <span v-if="stats.top3KD[1]" class="rank-2">{{ stats.top3KD[1].k }}:{{ stats.top3KD[1].d }}</span>
              <span v-else class="list-item-placeholder"></span>
              <span v-if="stats.top3KD[2]" class="rank-3">{{ stats.top3KD[2].k }}:{{ stats.top3KD[2].d }}</span>
              <span v-else class="list-item-placeholder"></span>
            </div>
          </div>
        </div>

        <!-- Rivalries -->
        <div class="card list-card">
          <div class="card-title">Biggest Rivals</div>
          <div class="card-value list-items">
            <div class="list-column rank-col">
              <span class="rank-label rank-1">1st</span>
              <span class="rank-label rank-2">2nd</span>
              <span class="rank-label rank-3">3rd</span>
            </div>
            <div class="list-column">
              <span v-if="stats.topRivalries[0]" class="rank-1 rivalry">
                <span class="rival-name">{{ stats.topRivalries[0].a }}</span> <span class="rivalry-vs">vs</span> <span class="rival-name">{{ stats.topRivalries[0].b }}</span>
              </span>
              <span v-else class="list-item-placeholder">—</span>
              <span v-if="stats.topRivalries[1]" class="rank-2 rivalry">
                <span class="rival-name">{{ stats.topRivalries[1].a }}</span> <span class="rivalry-vs">vs</span> <span class="rival-name">{{ stats.topRivalries[1].b }}</span>
              </span>
              <span v-else class="list-item-placeholder">2nd place</span>
              <span v-if="stats.topRivalries[2]" class="rank-3 rivalry">
                <span class="rival-name">{{ stats.topRivalries[2].a }}</span> <span class="rivalry-vs">vs</span> <span class="rival-name">{{ stats.topRivalries[2].b }}</span>
              </span>
              <span v-else class="list-item-placeholder">3rd place</span>
            </div>
            <div class="list-column">
              <span v-if="stats.topRivalries[0]" class="rank-1 rivalry-kos">{{ stats.topRivalries[0].total }} KOs</span>
              <span v-else class="list-item-placeholder"></span>
              <span v-if="stats.topRivalries[1]" class="rank-2 rivalry-kos">{{ stats.topRivalries[1].total }} KOs</span>
              <span v-else class="list-item-placeholder"></span>
              <span v-if="stats.topRivalries[2]" class="rank-3 rivalry-kos">{{ stats.topRivalries[2].total }} KOs</span>
              <span v-else class="list-item-placeholder"></span>
            </div>
          </div>
        </div>

        <!-- 1 Night Winnings -->
        <div class="card list-card">
          <div class="card-title">Top 1 Night Winnings</div>
          <div class="card-value list-items">
            <div class="list-column rank-col">
              <span class="rank-label rank-1">1st</span>
              <span class="rank-label rank-2">2nd</span>
              <span class="rank-label rank-3">3rd</span>
            </div>
            <div class="list-column">
              <span v-if="stats.top1NightWinnings[0]" class="rank-1">${{ stats.top1NightWinnings[0].net.toFixed(2) }}</span>
              <span v-else class="list-item-placeholder">—</span>
              <span v-if="stats.top1NightWinnings[1]" class="rank-2">${{ stats.top1NightWinnings[1].net.toFixed(2) }}</span>
              <span v-else class="list-item-placeholder">2nd place</span>
              <span v-if="stats.top1NightWinnings[2]" class="rank-3">${{ stats.top1NightWinnings[2].net.toFixed(2) }}</span>
              <span v-else class="list-item-placeholder">3rd place</span>
            </div>
            <div class="list-column">
              <span v-if="stats.top1NightWinnings[0]" class="rank-1">{{ stats.top1NightWinnings[0].name }}</span>
              <span v-else class="list-item-placeholder"></span>
              <span v-if="stats.top1NightWinnings[1]" class="rank-2">{{ stats.top1NightWinnings[1].name }}</span>
              <span v-else class="list-item-placeholder"></span>
              <span v-if="stats.top1NightWinnings[2]" class="rank-3">{{ stats.top1NightWinnings[2].name }}</span>
              <span v-else class="list-item-placeholder"></span>
            </div>
            <div class="list-column">
              <span v-if="stats.top1NightWinnings[0]" class="rank-1 date-subtext">{{ stats.top1NightWinnings[0].date }}</span>
              <span v-else class="list-item-placeholder"></span>
              <span v-if="stats.top1NightWinnings[1]" class="rank-2 date-subtext">{{ stats.top1NightWinnings[1].date }}</span>
              <span v-else class="list-item-placeholder"></span>
              <span v-if="stats.top1NightWinnings[2]" class="rank-3 date-subtext">{{ stats.top1NightWinnings[2].date }}</span>
              <span v-else class="list-item-placeholder"></span>
            </div>
          </div>
        </div>

        <!-- Top Quad Pots -->
        <div class="card list-card">
          <div class="card-title">Top 3 Quad Pot Wins</div>
          <div class="card-value list-items">
            <div class="list-column rank-col">
              <span class="rank-label rank-1">1st</span>
              <span class="rank-label rank-2">2nd</span>
              <span class="rank-label rank-3">3rd</span>
            </div>
            <div class="list-column">
              <span v-if="stats.topQuadPots[0]" class="rank-1">${{ stats.topQuadPots[0].amount.toFixed(2) }}</span>
              <span v-else class="list-item-placeholder">—</span>
              <span v-if="stats.topQuadPots[1]" class="rank-2">${{ stats.topQuadPots[1].amount.toFixed(2) }}</span>
              <span v-else class="list-item-placeholder">$0.00</span>
              <span v-if="stats.topQuadPots[2]" class="rank-3">${{ stats.topQuadPots[2].amount.toFixed(2) }}</span>
              <span v-else class="list-item-placeholder">$0.00</span>
            </div>
            <div class="list-column">
              <span v-if="stats.topQuadPots[0]" class="rank-1">{{ stats.topQuadPots[0].name }}</span>
              <span v-else class="list-item-placeholder"></span>
              <span v-if="stats.topQuadPots[1]" class="rank-2">{{ stats.topQuadPots[1].name }}</span>
              <span v-else class="list-item-placeholder"></span>
              <span v-if="stats.topQuadPots[2]" class="rank-3">{{ stats.topQuadPots[2].name }}</span>
              <span v-else class="list-item-placeholder"></span>
            </div>
            <div class="list-column">
              <span v-if="stats.topQuadPots[0] && stats.topQuadPots[0].date" class="rank-1 date-subtext">{{ stats.topQuadPots[0].date }}</span>
              <span v-else class="list-item-placeholder"></span>
              <span v-if="stats.topQuadPots[1] && stats.topQuadPots[1].date" class="rank-2 date-subtext">{{ stats.topQuadPots[1].date }}</span>
              <span v-else class="list-item-placeholder"></span>
              <span v-if="stats.topQuadPots[2] && stats.topQuadPots[2].date" class="rank-3 date-subtext">{{ stats.topQuadPots[2].date }}</span>
              <span v-else class="list-item-placeholder"></span>
            </div>
          </div>
        </div>

        <div class="card stat-card">
          <span class="card-title">All Time {{ CURRENCY }} on Table</span>
          <span class="card-value">${{ stats.totalPot }}</span>
        </div>
        <div class="card stat-card">
          <span class="card-title">Poker Nights</span>
          <span class="card-value">{{ stats.pokerNightsCount }}</span>
        </div>
        <div class="card stat-card">
          <span class="card-title">Total Players</span>
          <span class="card-value">{{ stats.totalPlayers }}</span>
        </div>
        <div class="card stat-card">
          <span class="card-title">Total KOs</span>
          <span class="card-value">{{ stats.totalKOs }}</span>
        </div>
        <div class="card stat-card">
          <span class="card-title">Current Quad Pot</span>
          <span class="card-value">${{ quadPotValue }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { TRANSACTIONS, CURRENCY } from '../../config/leaderboard.js'
import { HOUSE_RULES } from '../../config/houseRules.js'
import NetChart from '../NetChart.vue'
import { useQuadPot } from '../../logic/useQuadPot.js'

const { quadPotValue } = useQuadPot()
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

  const pokerNightDates = [...new Set(TRANSACTIONS.filter(t => t.amount > 0).map(t => t.date))]
  const pokerNightsCount = pokerNightDates.length
  const totalPlayers = players.length
  const totalKOs = elimRules.length
  const topQuadPots = TRANSACTIONS.filter(t => t.quad).sort((a, b) => b.amount - a.amount).slice(0, 3);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    return `${m}/${d}/${y.slice(-2)}`;
  };

  const formattedQuadPots = topQuadPots.map(p => ({ ...p, date: formatDate(p.date) }));

  const nightNets = []
  for (const date of pokerNightDates) {
    const nightTxs = TRANSACTIONS.filter(t => t.date === date)
    const playerTotals = {}
    for (const t of nightTxs) {
      if (!playerTotals[t.name]) playerTotals[t.name] = { name: t.name, buyin: 0, payout: 0 }
      if (t.type === 'buyin') playerTotals[t.name].buyin += t.amount
      else playerTotals[t.name].payout += t.amount
    }
    for (const pt of Object.values(playerTotals)) {
      const net = pt.payout - pt.buyin
      if (net > 0) {
        nightNets.push({ name: pt.name, date, net })
      }
    }
  }
  const top1NightWinnings = nightNets.sort((a, b) => b.net - a.net).slice(0, 3).map(n => ({
    ...n,
    date: formatDate(n.date)
  }))

  return {
    top3KD,
    topRivalries,
    top1NightWinnings,
    topQuadPots: formattedQuadPots,
    mostKOs: mostKOEntry ? { name: mostKOEntry[0], count: mostKOEntry[1] } : { name: '—', count: 0 },
    mostBustedName: mostBustedEntry ? mostBustedEntry[0] : '—',
    mostBustedCount: mostBustedEntry ? mostBustedEntry[1] : 0,
    biggestWinner: biggestWinner?.name ?? '—',
    biggestWin: biggestWinner?.net > 0 ? biggestWinner.net.toFixed(2) : '0.00',
    totalPot: totalPot.toFixed(2),
    pokerNightsCount,
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
  gap: clamp(0.3rem, 1vw, 0.5rem);
  flex-grow: 1;
  align-content: start;
  overflow-y: auto;
}

.card {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 8px;
  padding: clamp(0.3rem, 1vh, 1.5rem) clamp(0.4rem, 1vw, 1.5rem);
  display: flex;
}
.list-card {
  flex-direction: column;
  gap: 0.2rem;
}

.stat-card {
  justify-content: space-between;
  align-items: center;
  grid-column: span 1;
}

.xxx {
  font-size: clamp(0.55rem, 1.5vh, 3rem);
  color: var(--textMuted, #7a9e7e);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  white-space: nowrap;
}

.card-value {
  font-size: clamp(0.75rem, 1.75vh, 3rem);
  font-weight: bold;
  color: var(--textPrimary, #f0e6c8);
  font-family: monospace;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-value.highlight {
  color: var(--highlight, #c9a84c);
}

.card-title {
  font-size: clamp(0.55rem, 1.25vh, 3rem);
  color: var(--textMuted, #7a9e7e);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  text-align: center;
  margin-bottom: 0.1rem;
}

.list-items {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 0.5rem;
  width: 100%;
}

.list-column {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: left;
  gap: 0.2rem;
}

.rank-col {
  flex: 0 0 2rem;
}


.rank-label {
  opacity: 0.7;
  font-size: 0.8em;
}

.rank-1 {
  color: var(--highlight, #c9a84c);
}

.rank-2 {
  font-size: 0.85em;
  opacity: 0.8;
  color: var(--textPrimary, #f0e6c8);
}

.rank-3 {
  font-size: 0.8em;
  opacity: 0.6;
  color: var(--textPrimary, #f0e6c8);
}

.rivalry {
  text-transform: none;
  display: flex;
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

.date-subtext {
  font-size: 0.75em;
  opacity: 0.7;
}

.list-item-placeholder {
  font-size: clamp(0.7rem, 1.0vw, 0.8rem);
  color: var(--textMuted, #7a9e7e);
  opacity: 0.6;
  text-align: left;
}
</style>
