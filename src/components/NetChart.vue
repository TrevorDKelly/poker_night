<template>
  <div class="chart-container">
    <!-- Legend -->
    <div class="chart-legend" v-if="playerLineData.length > 0">
      <div
        v-for="player in playerLineData"
        :key="player.name"
        class="legend-item"
      >
        <span class="legend-color" :style="{ backgroundColor: player.color }"></span>
        <span class="legend-name">{{ player.name }}</span>
      </div>
    </div>

    <div class="chart-wrapper">
      <svg v-if="historyPoints.length > 1" class="chart-svg" viewBox="0 0 400 150">
        <!-- Grid Lines & Labels -->
        <g class="grid-lines">
          <line x1="40" y1="10" x2="390" y2="10" stroke="rgba(255,255,255,0.05)" stroke-dasharray="2" />
          <line x1="40" y1="45" x2="390" y2="45" stroke="rgba(255,255,255,0.05)" stroke-dasharray="2" />
          <line x1="40" y1="80" x2="390" y2="80" stroke="rgba(255,255,255,0.05)" stroke-dasharray="2" />
          <line x1="40" y1="115" x2="390" y2="115" stroke="rgba(255,255,255,0.05)" stroke-dasharray="2" />
          <!-- Zero line -->
          <line
            :x1="40"
            :y1="zeroY"
            :x2="390"
            :y2="zeroY"
            stroke="rgba(201, 168, 76, 0.2)"
            stroke-width="1.5"
          />
        </g>

        <!-- Y Axis Labels (no dollar amounts, just +/0/-) -->
        <g class="chart-labels y-labels">
          <text x="32" y="14" text-anchor="end">+</text>
          <text x="32" :y="zeroY + 4" text-anchor="end">0</text>
          <text x="32" y="119" text-anchor="end">–</text>
        </g>

        <!-- Paths for each player -->
        <g v-for="player in playerLineData" :key="player.name">
          <path
            :d="player.path"
            fill="none"
            :stroke="player.color"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <!-- Dots at endpoints -->
          <circle
            v-for="pt in player.dots"
            :key="pt.x + '-' + pt.y"
            :cx="pt.x"
            :cy="pt.y"
            r="2.5"
            :fill="player.color"
            stroke="#122014"
            stroke-width="1.0"
          />
        </g>

        <!-- X Axis Labels -->
        <g class="chart-labels x-labels">
          <text
            v-for="(pt, dIdx) in chartPoints"
            :key="pt.date"
            :x="40 + (dIdx * (350 / (chartPoints.length - 1)))"
            y="138"
            text-anchor="middle"
          >
            {{ formatDate(pt.date) }}
          </text>
        </g>
      </svg>
      <div v-else class="no-chart-data">
        Add transactions across multiple dates to see the progress line chart.
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { GRAPH_TIMEPOINT_COUNT } from '../config/constants'

const props = defineProps({
  transactions: {
    type: Array,
    required: true,
  },
  currency: {
    type: String,
    default: '$',
  },
})

// Assign colors by rank, not by player name.
const RANK_COLORS = [
  '#c9a84c', // 1st (Gold)
  '#c0c0c0', // 2nd (Silver)
  '#cd7f32', // 3rd (Bronze)
  '#df4b4b', // 4th (Heart Red)
  '#4ba0df', // 5th (Diamond Blue)
  '#5dca6e', // 6th (Club Green)
  '#da70d6', // 7th (Purple/Orchid)
  '#e9967a', // 8th (Salmon)
  '#f4a460', // 9th (Sandy Brown)
  '#95a5a6', // 10th (Grey)
  '#20b2aa', // Light Sea Green
  '#ff69b4', // Hot Pink
  '#8a2be2', // Blue Violet
  '#00ced1', // Dark Turquoise
  '#ff8c00', // Dark Orange
  '#adff2f', // Green Yellow
  '#ff1493', // Deep Pink
  '#4682b4', // Steel Blue
  '#dc143c', // Crimson
  '#00fa9a', // Medium Spring Green
  '#ff00ff', // Magenta
  '#1e90ff', // Dodger Blue
]

const uniqueDates = computed(() => {
  const datesSet = new Set()
  for (const t of props.transactions) {
    if (t.date) datesSet.add(t.date)
  }
  return Array.from(datesSet).sort()
})

// historyPoints: one entry per unique date, tracking cumulative net per player.
// playersPresent: set of player names who had a transaction on that specific date.
const historyPoints = computed(() => {
  const dates = uniqueDates.value
  if (dates.length === 0) return []

  const allNames = Array.from(new Set(props.transactions.map(t => t.name)))
  const runningTotals = {}
  for (const name of allNames) {
    runningTotals[name] = { buyIns: 0, payouts: 0 }
  }

  return dates.map(date => {
    const presentThisDate = new Set()
    for (const t of props.transactions) {
      if (t.date === date) {
        presentThisDate.add(t.name)
        if (t.type === 'buyin') runningTotals[t.name].buyIns += t.amount
        else runningTotals[t.name].payouts += t.amount
      }
    }

    const totals = {}
    for (const name of allNames) {
      totals[name] = runningTotals[name].payouts - runningTotals[name].buyIns
    }

    return { date, totals, present: presentThisDate }
  })
})

// Take only the last GRAPH_TIMEPOINT_COUNT = 7 dates (no padding, no Start point)
const chartPoints = computed(() => {
  const pts = historyPoints.value
  if (pts.length <= GRAPH_TIMEPOINT_COUNT) return pts
  return pts.slice(pts.length - GRAPH_TIMEPOINT_COUNT)
})

// Only include players who appear in at least one of the chartPoints dates
const activePlayerNames = computed(() => {
  const names = new Set()
  for (const pt of chartPoints.value) {
    for (const name of pt.present) {
      names.add(name)
    }
  }
  return Array.from(names)
})

const sortedPlayerNames = computed(() => {
  if (chartPoints.value.length === 0) {
    return activePlayerNames.value
  }
  const lastTotals = chartPoints.value[chartPoints.value.length - 1].totals
  return [...activePlayerNames.value].sort((a, b) => {
    const netA = lastTotals[a] || -Infinity
    const netB = lastTotals[b] || -Infinity
    return netB - netA
  })
})

// Max/Min cumulative nets across chartPoints only
const maxNet = computed(() => {
  let maxVal = 10
  for (const pt of chartPoints.value) {
    for (const name of activePlayerNames.value) {
      if (pt.present.has(name) && pt.totals[name] > maxVal) maxVal = pt.totals[name]
    }
  }
  return Math.ceil(maxVal / 5) * 5
})

const minNet = computed(() => {
  let minVal = -10
  for (const pt of chartPoints.value) {
    for (const name of activePlayerNames.value) {
      if (pt.present.has(name) && pt.totals[name] < minVal) minVal = pt.totals[name]
    }
  }
  return Math.floor(minVal / 5) * 5
})

const zeroY = computed(() => {
  const min = minNet.value
  const max = maxNet.value
  const effectiveMin = max > 0 && min < 0 ? -max : min
  const range = max - effectiveMin || 1
  // Scale zero line inside the 120px tall plot area (y=10 to y=115)
  const ratio = (max - 0) / range
  return 10 + ratio * 105
})

const playerLineData = computed(() => {
  const pts = chartPoints.value
  if (pts.length < 2) return []

  const min = minNet.value
  const max = maxNet.value
  const effectiveMin = max > 0 && min < 0 ? -max : min
  const range = max - effectiveMin || 1
  const paddingLeft = 40
  const totalWidth = 350

  const getScaledNet = (net) => {
    if (net >= 0) return net
    if (min >= 0 || max <= 0) return net
    return net * (max / Math.abs(min))
  }

  const toX = (idx) => paddingLeft + (idx * (totalWidth / (pts.length - 1)))
  const toY = (net) => 10 + ((max - getScaledNet(net)) / range) * 105

  return sortedPlayerNames.value.map((name, pIdx) => {
    const color = RANK_COLORS[pIdx % RANK_COLORS.length]
    const dots = []
    const pointsForPath = []
    let firstAppearanceIndex = -1

    pts.forEach((pt, idx) => {
      if (pt.present.has(name)) {
        if (firstAppearanceIndex === -1) {
          firstAppearanceIndex = idx
        }
        const x = toX(idx)
        const y = toY(pt.totals[name])
        dots.push({ x, y })
        pointsForPath.push({ x, y })
      }
    })

    // If player's first appearance is not the first point of the chart,
    // add a point at the previous timepoint with a value of 0.
    if (firstAppearanceIndex > 0) {
      const prevX = toX(firstAppearanceIndex - 1)
      const zeroY = toY(0)
      pointsForPath.unshift({ x: prevX, y: zeroY })
    }

    // Build a single continuous path connecting all present points
    const path = pointsForPath.length > 0
      ? 'M ' + pointsForPath.map(p => `${p.x},${p.y}`).join(' L ')
      : ''

    return { name, color, path, dots }
  })
})

const formatDate = (dateStr) => {
  if (!dateStr || dateStr === 'Start') return ''
  const [, month, day] = dateStr.split('-')
  return `${month}/${day}`
}
</script>

<style scoped>
.chart-container {
  display: flex;
  flex-grow: 1;
}

.chart-legend {
  display: flex;
  flex-direction: column;
  justify-content: start;
  gap: 0.15rem;
  padding-right: 0.25rem;
  min-width: 40px;
  max-width: 100px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.25rem; /* Reduced gap */
  font-size: clamp(0.3rem, 1.5vh, 3rem);
  color: var(--textPrimary, #f0e6c8);
}

.legend-color {
  width: 8px;
  height: 8px;
  border-radius: 2px;
  display: inline-block;
  flex-shrink: 0;
}

.legend-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5em; /* Adjusted line height for better vertical spacing */
}

.chart-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1; /* Allow wrapper to take remaining space */
}

.chart-svg {
  width: 100%;
  height: auto;
}

.grid-lines line {
  stroke-linecap: round;
}

.chart-labels text {
  fill: var(--textMuted, #7a9e7e);
  font-size: 8px;
  font-family: monospace;
}

.x-labels text {
  font-size: 7px;
}

.no-chart-data {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  font-size: 0.85rem;
  color: var(--textMuted, #7a9e7e);
  font-style: italic;
  text-align: center;
  padding: 2rem;
}
</style>
