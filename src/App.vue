<script setup>
import { theme } from './config/theme.js'
import { onMounted, onUnmounted, ref, watch, computed } from 'vue'
import ChipAndHandValues from './components/flipper_pages/ChipAndHandValues.vue'
import HouseRules from './components/flipper_pages/HouseRules.vue'
import Leaderboard from './components/flipper_pages/Leaderboard.vue'
import Stats from './components/flipper_pages/Stats.vue'
import FooterBar from './components/FooterBar.vue'
import { useFlipper } from './logic/useFlipper.js'

const windowWidth = ref(window.innerWidth)
const handleResize = () => { windowWidth.value = window.innerWidth }

onMounted(() => {
  window.addEventListener('resize', handleResize)

  // Inject theme as CSS variables on <html> so all components can use them
  const root = document.documentElement.style
  Object.entries(theme).forEach(([key, value]) => {
    root.setProperty(`--${key}`, value)
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

const mobilePages = [
  ChipAndHandValues,
  HouseRules,
  ChipAndHandValues,
  Leaderboard,
  ChipAndHandValues,
  Stats,
]

const desktopPages = [
  HouseRules,
  Leaderboard,
  Stats,
]

const pages = computed(() => {
  return windowWidth.value < 1024 ? mobilePages : desktopPages
})

const {
  currentIndex,
  isPaused,
  autoResumeMsRemaining,
  secondsRemaining,
  autoResumeSecondsRemaining,
  restartFlipping,
  handleTouchStart,
  handleTouchEnd,
  handleDoubleTap,
} = useFlipper(pages)

// Maintain sliding visual states
const leftPageIdx = ref(currentIndex.value)
const rightPageIdx = ref((currentIndex.value + 1) % pages.value.length)

const animationDirection = ref('')
const isTransitioning = ref(false)

// Keep local pages reference in sync when currentIndex changes
watch(currentIndex, (newIdx, oldIdx) => {
  if (isTransitioning.value) return

  let dir = 'forward'
  const len = pages.value.length
  if (newIdx === (oldIdx - 1 + len) % len) {
    dir = 'backward'
  }

  animationDirection.value = dir
  isTransitioning.value = true

  setTimeout(() => {
    leftPageIdx.value = newIdx
    rightPageIdx.value = (newIdx + 1) % len
    animationDirection.value = ''
    isTransitioning.value = false
  }, 600)
})

// Update indices when changing page layout (desktop <> mobile)
watch(pages, () => {
  currentIndex.value = 0
  leftPageIdx.value = 0
  rightPageIdx.value = 1 % pages.value.length
})

// --- Custom Timer Feature ---
const timerState = ref('idle')
const handleTimerStateChange = (state) => {
  timerState.value = state
}
</script>

<template>
  <main
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
    @click="handleDoubleTap"
    :class="{ 'timer-expired': timerState === 'expired' }"
  >
    <div class="content-wrapper">
      <div v-if="windowWidth >= 1024" class="fixed-left-panel">
        <ChipAndHandValues />
      </div>
      <div class="flipper-container-wrapper">
        <div
          class="flipper-container"
          :class="[
            animationDirection ? `slide-${animationDirection}` : ''
          ]"
        >
          <template v-if="animationDirection === 'forward'">
            <div class="half-pane">
              <component :is="pages[leftPageIdx]" />
            </div>
            <div class="half-pane">
              <component :is="pages[rightPageIdx]" />
            </div>
            <div class="half-pane">
              <component :is="pages[(rightPageIdx + 1) % pages.length]" />
            </div>
          </template>

          <template v-else-if="animationDirection === 'backward'">
            <div class="half-pane">
              <component :is="pages[(leftPageIdx - 1 + pages.length) % pages.length]" />
            </div>
            <div class="half-pane">
              <component :is="pages[leftPageIdx]" />
            </div>
            <div class="half-pane">
              <component :is="pages[rightPageIdx]" />
            </div>
          </template>

          <template v-else>
            <div class="half-pane">
              <component :is="pages[leftPageIdx]" />
            </div>
            <div class="half-pane">
              <component :is="pages[rightPageIdx]" />
            </div>
          </template>
        </div>
      </div>
    </div>

    <FooterBar
      :isPaused="isPaused"
      :secondsRemaining="secondsRemaining"
      :autoResumeMsRemaining="autoResumeMsRemaining"
      :autoResumeSecondsRemaining="autoResumeSecondsRemaining"
      @restart="restartFlipping"
      @timer-state-change="handleTimerStateChange"
    />
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background-color: var(--bgPage);
  background-image:
    radial-gradient(ellipse at center, #245c27 0%, #163a18 70%);
  color: var(--textPrimary);
  font-family: var(--sans);
  overflow: hidden;
  position: relative;
  transition: background-color 0.8s, background-image 0.8s;
}

main.timer-expired {
  background-color: var(--warning);
  background-image: radial-gradient(ellipse at center, #d62828 0%, #8b0000 70%);
}

.content-wrapper {
  display: flex;
  flex-grow: 1;
  width: 97%;
  margin: auto;
  gap: 2rem;
  box-sizing: border-box;
  padding: 2rem 0;
  height: 94%;
}

.fixed-left-panel {
  flex: 0 0 calc(50% - 1rem);
  width: calc(50% - 1rem);
  height: 100%;
  position: relative; /* ensure absolute positioning works for children */
}

.flipper-container-wrapper {
  flex: 1;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
}

/* The runner track that contains all the sliding half-pane blocks. */
.flipper-container {
  display: flex;
  width: 100%;
  height: 100%;
  gap: 2rem;
  box-sizing: border-box;
}

/* Each half-page block takes up exactly 50% width of container (minus half of the gap of 2rem) */
.half-pane {
  flex: 0 0 calc(50% - 1rem);
  width: calc(50% - 1rem);
  height: 100%;
  box-sizing: border-box;
}

@media (min-width: 1024px) {
  /* On desktop, the flipper wrapper is already 50% of screen. Show 1 pane inside it. */
  .half-pane {
    flex: 0 0 100%;
    width: 100%;
  }

  .content-wrapper {
    width: 100%;
    padding: 0;
    gap: 0; /* We can use margins inside to space out */
    height:94%
  }

  .fixed-left-panel {
    flex: 0 0 50%;
    width: 50%;
  }

  .flipper-container-wrapper {
    padding-top: 1rem;
    padding-bottom: 1rem;
    padding-right: 1rem; /* bring edge spacing back for flipper side */
    padding-left: 1rem;
  }
}

/* Slide Transition Animations */
/* When moving forward: desktop (1 pane visible) and mobile (1 pane visible) slide by 100% + gap */
.slide-forward {
  animation: slideForwardAnim 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards;
}

.slide-backward {
  animation: slideBackwardAnim 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards;
}

@keyframes slideForwardAnim {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(-100% - 2rem));
  }
}

@keyframes slideBackwardAnim {
  0% {
    transform: translateX(calc(-100% - 2rem));
  }
  100% {
    transform: translateX(0);
  }
}

/* Responsive design for tablets portrait and mobile */
@media (max-width: 1024px) {
  .half-pane {
    flex: 0 0 100%;
    width: 100%;
  }
}
</style>
