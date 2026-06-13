<template>
  <div class="flipper-panel">
    <!-- Header -->
    <div class="panel-header">
      <h2 class="panel-title">📜 House Rules</h2>
    </div>

    <!-- Info section -->
    <div class="info-section">
      <div class="info-item">
        <span class="info-label">💸 Break a Rule:</span>
        <span class="info-value">Put 50 in the quad pot</span>
      </div>
      <div class="info-item">
        <span class="info-label">🎯 Knock Out a Player:</span>
        <span class="info-value">You get to add a house rule</span>
      </div>
      <div class="info-item">
        <span class="info-label">♦️ Hit 4 of a Kind:</span>
        <span class="info-value">Win the quad pot (💰 <span class="highlight">${{ quadPotValue }}</span>)</span>
      </div>
    </div>

    <!-- Rules list -->
    <div class="rules-list panel-scrollable">
      <div v-for="(item, i) in HOUSE_RULES" :key="i" class="rule-row panel-row">
        <div class="rule-number panel-row-number">{{ i + 1 }}</div>
        <div class="rule-body">
          <p class="rule-text">{{ item.rule }}</p>
          <span class="rule-author" v-if="item.author">
            Added by {{ item.author }}
            <template v-if="item.eliminatedPlayer"> for eliminating {{ item.eliminatedPlayer }}</template>
            <template v-if="item.date"> · {{ item.date }}</template>
          </span>
        </div>
      </div>
      <div v-if="HOUSE_RULES.length === 0" class="no-rules">
        No house rules yet. Knock someone out to add one!
      </div>
    </div>
  </div>
</template>

<script setup>
import { HOUSE_RULES } from '../../config/houseRules.js'
import { useQuadPot } from '../../logic/useQuadPot.js'

const { quadPotValue } = useQuadPot()
</script>

<style scoped>
.info-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem 0.6rem;
  background: rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.info-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.8rem;
}

.info-label {
  color: var(--textPrimary, #f0e6c8);
  font-weight: 600;
  white-space: nowrap;
  flex:1;
  text-align: right;
}

.info-value {
  color: var(--textMuted, #7a9e7e);
  text-align: left;
  flex: 1;
}

.highlight {
  color: var(--highlight, #c9a84c);
  font-weight: bold;
}

.rules-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  flex-grow: 1;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--borderSubtle) transparent;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.3);
  margin-top: 0.5rem;
}

.rule-row {
  padding: 0.2rem 0.75rem;
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: background-color 0.2s ease;
  justify-content: flex-start;
}

.rule-row:last-child {
  border-bottom: none;
}

.rule-row:hover {
  background: rgba(201, 168, 76, 0.08);
}

.rule-number {
  font-size: 0.75rem;
  font-weight: bold;
  color: var(--highlight, #c9a84c);
  min-width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(201, 168, 76, 0.15);
  border-radius: 50%;
  flex-shrink: 0;
}

.rule-body {
  flex-grow: 1;
  min-width: 0;
  text-align: left;
}

.rule-text {
  margin: 0;
  font-size: 0.85rem;
  color: var(--textPrimary, #f0e6c8);
  line-height: 1.4;
}

.rule-author {
  font-size: 0.7rem;
  color: var(--textMuted, #7a9e7e);
  font-style: italic;
  display: block;
  margin-top: 0.25rem;
}

.no-rules {
  color: var(--textMuted, #7a9e7e);
  font-style: italic;
  font-size: 0.9rem;
  padding: 1.5rem;
  text-align: center;
}
</style>
