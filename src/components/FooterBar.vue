<template>
  <footer>
    <div class="controls-info">
      <span class="keys">⬅️ ➡️ Keys / Swipe</span> to flip •
      <span class="keys">Space / Double Tap</span> to pause
    </div>

    <Timer @state-change="$emit('timer-state-change', $event)" />

    <button @click.stop="showSpinner = true" class="spinner-btn" title="Mini-game Spinner">
      🎲 Spin for Game
    </button>

    <button @click.stop="toggleFullscreen" class="fullscreen-btn" title="Toggle Fullscreen">
      ⛶
    </button>

    <div class="status-indicator">
      <template v-if="!isPaused">
        Next page in <span class="countdown">{{ secondsRemaining }}s</span>
      </template>
      <template v-else>
        <span class="paused-badge">Paused</span>
        <span v-if="autoResumeMsRemaining > 0" class="auto-resume-info">
          ({{ autoResumeSecondsRemaining }}s)
        </span>
        <button @click.stop="$emit('restart')" class="resume-btn">
          ▶
        </button>
      </template>
    </div>
  </footer>
  <div v-if="showSpinner" class="spinner-modal-backdrop" @click="showSpinner = false">
    <div class="spinner-modal-content" @click.stop>
      <iframe :src="spinnerUrl" width="100%" height="550px" scrolling="no" frameborder="0"></iframe>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Timer from './Timer.vue'
import { MINI_GAMES } from '../config/miniGames.js'

const showSpinner = ref(false)

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      console.error(`Error attempting to enable fullscreen: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
}

const spinnerUrl = computed(() => {
  const choices = MINI_GAMES.join(',')
  return `https://pickerwheel.com/emb/?choices=${encodeURIComponent(choices)}`
})

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
  height: 40px;
  padding: 0 1rem;
  background: var(--bgFooter);
  backdrop-filter: blur(10px);
  border-top: 1px solid var(--borderSubtle);
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  flex-shrink: 0;
  gap: 0.5rem;
}

.spinner-btn {
  background-color: transparent;
  border: 1px solid var(--borderSubtle);
  color: var(--textMuted);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.75rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  transition: all 0.2s;
  flex: 0.75;
}

.spinner-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--textPrimary);
}

.fullscreen-btn {
  background-color: transparent;
  border: 1px solid var(--borderSubtle);
  color: var(--textMuted);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.fullscreen-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--textPrimary);
}

.controls-info {
  font-size: 0.65rem;
  color: var(--textMuted);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  flex: 2;
}

.keys {
  color: var(--highlight);
  background-color: var(--bgKey);
  border: 1px solid var(--borderSubtle);
  padding: 0.1rem 0.2rem;
  border-radius: 4px;
  font-size: 0.6rem;
}

.status-indicator {
  display: flex;
  flex: 1;
  justify-content: left;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
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
  font-size: 0.75rem;
  border: 1px solid var(--warning);
  padding: 0.1rem 0.3rem;
  border-radius: 4px;
}

.auto-resume-info {
  font-size: 0.75rem;
  color: var(--textMuted);
}

.resume-btn {
  background-color: var(--highlight);
  color: #0d1f0f;
  border: none;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.75rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  transition: opacity 0.2s;
}

.resume-btn:hover {
  opacity: 0.85;
}

.spinner-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.spinner-modal-content {
  background-color: white;
  padding: 1rem;
  border-radius: 0.5rem;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
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
