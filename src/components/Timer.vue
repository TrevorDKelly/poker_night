<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { TIMER_DURATION_MS } from '../config/constants.js'

const emit = defineEmits(['state-change'])

const timerMsRemaining = ref(TIMER_DURATION_MS)
const timerState = ref('idle') // 'idle' | 'running' | 'expired'
let timerIntervalId = null

const startTimer = () => {
  if (timerIntervalId) {
    clearInterval(timerIntervalId)
  }
  timerMsRemaining.value = TIMER_DURATION_MS
  timerState.value = 'running'
  emit('state-change', timerState.value)

  const lastTime = Date.now()
  timerIntervalId = setInterval(() => {
    if (timerState.value !== 'running') {
      clearInterval(timerIntervalId)
      return
    }
    const delta = Date.now() - lastTime
    timerMsRemaining.value = Math.max(0, TIMER_DURATION_MS - delta)

    if (timerMsRemaining.value <= 0) {
      clearInterval(timerIntervalId)
      timerIntervalId = null
      timerState.value = 'expired'
      emit('state-change', timerState.value)
      playDing()
    }
  }, 250)
}

const formattedTimer = computed(() => {
  const totalSecs = Math.ceil(timerMsRemaining.value / 1000)
  const mins = Math.floor(totalSecs / 60)
  const secs = totalSecs % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
})

const playDing = () => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)()

    // Play a nice crisp "ding" sound using AudioContext synthesizers
    // 1st note (A5)
    const osc1 = audioCtx.createOscillator()
    const gain1 = audioCtx.createGain()
    osc1.connect(gain1)
    gain1.connect(audioCtx.destination)

    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(880, audioCtx.currentTime) // A5
    gain1.gain.setValueAtTime(0.3, audioCtx.currentTime)
    gain1.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2)

    // 2nd note (C#6) slightly delayed
    const osc2 = audioCtx.createOscillator()
    const gain2 = audioCtx.createGain()
    osc2.connect(gain2)
    gain2.connect(audioCtx.destination)

    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(1109.73, audioCtx.currentTime + 0.1) // C#6
    gain2.gain.setValueAtTime(0.3, audioCtx.currentTime + 0.1)
    gain2.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.3)

    osc1.start()
    osc1.stop(audioCtx.currentTime + 1.5)

    osc2.start(audioCtx.currentTime + 0.1)
    osc2.stop(audioCtx.currentTime + 1.5)
  } catch (error) {
    console.error("Audio error: ", error)
  }
}

onUnmounted(() => {
  if (timerIntervalId) {
    clearInterval(timerIntervalId)
  }
})
</script>

<template>
  <div class="timer-controls">
    <template v-if="timerState === 'running'">
      <span class="timer-countdown">⏳ {{ formattedTimer }}</span>
    </template>
    <template v-else-if="timerState === 'expired'">
      <span class="timer-countdown pulse-warning">🚨 TIME UP!</span>
    </template>
    <button
      @click.stop="startTimer"
      class="timer-btn"
      :class="{ 'timer-btn-expired': timerState === 'expired' }"
    >
      {{ timerState === 'expired' ? '🔄 Restart Timer' : (timerState === 'running' ? '🔄 Restart' : '⏱️ Start Timer') }}
    </button>
  </div>
</template>

<style scoped>
.timer-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.timer-countdown {
  font-size: 1.1rem;
  font-weight: bold;
  color: var(--highlight);
  background-color: var(--bgKey);
  border: 1px solid var(--borderSubtle);
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
}

.pulse-warning {
  animation: pulseWarningAnim 1s infinite alternate;
  border-color: #ff4a4a;
  color: #ff4a4a;
}

@keyframes pulseWarningAnim {
  0% {
    box-shadow: 0 0 4px #ff4a4a;
  }
  100% {
    box-shadow: 0 0 15px #ff4a4a;
  }
}

.timer-btn {
  background-color: var(--highlight);
  color: #0d1f0f;
  border: none;
  padding: 0.4rem 0.9rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.85rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  transition: opacity 0.2s, background-color 0.2s, color 0.2s;
}

.timer-btn:hover {
  opacity: 0.85;
}

.timer-btn-expired {
  background-color: #ff4a4a;
  color: #ffffff;
}

@media (max-width: 900px) {
  .timer-controls {
    justify-content: center;
    width: 100%;
  }
}
</style>
