<template>
  <div class="leaderboard-list-container">
    <h3 class="list-title">{{ title }}</h3>
    <div class="board-list panel-scrollable">
      <div
        v-for="(p, i) in items"
        :key="p.name"
        class="board-row panel-row"
        :class="{
          'rank-first': i === 0,
          'rank-negative': p.value < 0,
        }"
      >
        <span class="col-rank">
          <span v-if="i === 0">🥇</span>
          <span v-else-if="i === 1">🥈</span>
          <span v-else-if="i === 2">🥉</span>
          <span v-else class="rank-num">{{ i + 1 }}</span>
        </span>
        <span class="col-name">{{ p.name }}</span>
        <span class="col-net" :class="p.value >= 0 ? 'positive' : 'negative-label'">
          <template v-if="p.value >= 0">{{ formatValue(p.value) }}</template>
          <template v-else>negative</template>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
  valueLabel: {
    type: String,
    default: 'Net',
  },
  formatValue: {
    type: Function,
    default: (value) => value,
  },
})
</script>

<style scoped>
.leaderboard-list-container {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  flex: 1;
  min-height: 0;
}
.list-title {
  font-size: clamp(0.75rem, 1.5vh, 3rem);
  font-weight: bold;
  color: var(--highlight, #c9a84c);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
  padding-bottom: 0.2rem;
  border-bottom: 1px solid var(--borderSubtle);
}
.board-list {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  flex-grow: 1;
  overflow-y: auto;
}

.board-row {
  padding: clamp(0.3rem, 1vh, 3rem) 0.75rem;
  font-size: clamp(0.8rem, 1.6vh, 3rem);
  color: var(--textPrimary, #f0e6c8);
  display: flex;
  align-items: center;
}

.board-row:hover {
  border-color: var(--borderSubtle);
}

.header-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none !important;
  font-size: 0.75rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--textMuted, #7a9e7e);
  padding: 0.3rem 0.75rem;
}

.rank-first {
  border-color: rgba(201, 168, 76, 0.5) !important;
  background: rgba(201, 168, 76, 0.08) !important;
}

.col-rank {
  width: 30px;
  text-align: left;
  font-size: clamp(0.8rem, 1.6vw, 1rem);
}

.rank-num {
  font-size: 0.75rem;
  color: var(--textMuted);
}

.col-name {
  flex-grow: 1;
  font-weight: 500;
  text-align: left;
}

.col-net {
  font-weight: bold;
}

.positive {
  color: var(--positive, #4caf50);
}

.negative-label {
  font-size: 0.9em;
  font-style: italic;
  opacity: 0.5;
  font-weight: normal;
}
</style>
