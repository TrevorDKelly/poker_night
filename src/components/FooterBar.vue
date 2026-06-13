<template>
  <footer>
    <div class="controls-info">
      <span class="keys">⬅️ ➡️ Keys / Swipe</span> to flip •
      <span class="keys">Space / Double Tap</span> to pause
    </div>

    <Timer @state-change="$emit('timer-state-change', $event)" />

    <div class="status-indicator">
      <template v-if="!isPaused">
        Next page in <span class="countdown">{{ secondsRemaining }}s</span>
      </template>
      <template v-else>
        <span class="paused-badge">Paused</span>
        <span v-if="autoResumeMsRemaining > 0" class="auto-resume-info">
          (Auto-resuming in {{ autoResumeSecondsRemaining }}s)
        </span>
        <button @click.stop="$emit('restart')" class="resume-btn">
          ▶ Restart Now
        </button>
      </template>
    </div>
  </footer>
</template>

<script setup>
import Timer from './Timer.vue'

defineProps({
  secondsRemaining: {
    type: Number,
    required: true
  },
  isPaused: {
    type: Boolean,
    required: true
  },
  autoResumeMsRemaining: {
    type: Number,
    required: true
  },
  autoResumeSecondsRemaining: {
    type: Number,
    required: true
  }
})

defineEmits(['restart', 'timer-state-change'])
</script>

<style scoped>
footer {
  width: 100%;
  height: 80px;
  padding: 0 2rem;
  background: var(--bgFooter);
  backdrop-filter: blur(10px);
  border-top: 1px solid var(--borderSubtle);
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  flex-shrink: 0;
  gap: 1rem;
}

.controls-info {
  font-size: 0.85rem;
  color: var(--textMuted);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.keys {
  color: var(--highlight);
  background-color: var(--bgKey);
  border: 1px solid var(--borderSubtle);
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.countdown {
  font-weight: bold;
  color: var(--highlight);
}

.paused-badge {
  color: var(--warning);
  font-weight: bold;
  text-transform: uppercase;
  font-size: 0.85rem;
  border: 1px solid var(--warning);
  padding: 0.1rem 0.5rem;
  border-radius: 4px;
}

.auto-resume-info {
  font-size: 0.85rem;
  color: var(--textMuted);
}

.resume-btn {
  background-color: var(--highlight);
  color: #0d1f0f;
  border: none;
  padding: 0.4rem 0.9rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.85rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  transition: opacity 0.2s;
}

.resume-btn:hover {
  opacity: 0.85;
}

@media (max-width: 900px) {
  footer {
    flex-wrap: wrap;
    height: auto;
    padding: 1rem;
    justify-content: center;
  }
}

@media (max-width: 600px) {
  footer {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>
