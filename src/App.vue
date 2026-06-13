<script setup>
import { theme } from './config/theme.js'
import { onMounted, ref, watch } from 'vue'
import ChipValues from './components/flipper_pages/ChipValues.vue'
import HandValues from './components/flipper_pages/HandValues.vue'
import HouseRules from './components/flipper_pages/HouseRules.vue'
import Leaderboard from './components/flipper_pages/Leaderboard.vue'
import Stats from './components/flipper_pages/Stats.vue'
import FooterBar from './components/FooterBar.vue'
import { useFlipper } from './logic/useFlipper.js'

// We have 5 half-page components now
const pages = [
  ChipValues,
  HandValues,
  HouseRules,
  Leaderboard,
  Stats,
]

// Inject theme as CSS variables on <html> so all components can use them
onMounted(() => {
  const root = document.documentElement.style
  Object.entries(theme).forEach(([key, value]) => {
    root.setProperty(`--${key}`, value)
  })
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

// Maintain sliding visual states: left section index and right section index
// In our half-page layout, the left side displays pages[currentIndex]
// and the right side displays pages[(currentIndex + 1) % pages.length]
const leftPageIdx = ref(currentIndex.value)
const rightPageIdx = ref((currentIndex.value + 1) % pages.length)

// For transitions, we want to slide pages across.
// We'll manage a state that tracks the active animation action.
// When currentIndex advances, the left item slides off-screen to the left and is removed,
// the right item slides to the left position, and a new right item slides in from the right.
// If navigating backwards, we do the reverse.
const animationDirection = ref('') // 'forward' | 'backward' | ''
const isTransitioning = ref(false)

// Keep local pages reference in sync when currentIndex changes
watch(currentIndex, (newIdx, oldIdx) => {
  if (isTransitioning.value) return // Prevent multiple overlap transitions

  // Determine direction
  let dir = 'forward'
  const len = pages.length
  // Handle edge wrap cases for backward
  if (newIdx === (oldIdx - 1 + len) % len) {
    dir = 'backward'
  }

  animationDirection.value = dir
  isTransitioning.value = true

  // Set transition class, then update the indices once transition ends
  setTimeout(() => {
    // End of translation animation: commit the new state
    leftPageIdx.value = newIdx
    rightPageIdx.value = (newIdx + 1) % len
    animationDirection.value = ''
    isTransitioning.value = false
  }, 600) // matches CSS transition time
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
    <div class="flipper-container-wrapper">
      <div
        class="flipper-container"
        :class="[
          animationDirection ? `slide-${animationDirection}` : ''
        ]"
      >
        <!-- When sliding forward: we have 3 panes in a row:
             [Left Out (for backward step)] [Left Pane] [Right Pane] [New Right Pane (for forward step)]
             But to keep it super smooth and robust, we can represent:
             1. The slot that is moving off to the left (Old Left)
             2. The slot moving from right to left (Old Right)
             3. The slot coming in from the right (New Right)
             Let's construct a continuous strip of 3 slots:
             - Slot A: The "leaving" column (visible during backward, or left on forward)
             - Slot B: The main Left Column
             - Slot C: The main Right Column
             - Slot D: The "entering" column (visible during forward)
        -->
        <template v-if="animationDirection === 'forward'">
          <!-- We show:
              1. Left page (sliding out left)
              2. Right page (sliding into the left position)
              3. Next Right page (sliding into the right position)
          -->
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
          <!-- We show:
              1. Previous Left page (sliding into the left position from off-page left)
              2. Left page (sliding into the right position)
              3. Right page (sliding out right)
          -->
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
          <!-- Normal stationary state -->
          <div class="half-pane">
            <component :is="pages[leftPageIdx]" />
          </div>
          <div class="half-pane">
            <component :is="pages[rightPageIdx]" />
          </div>
        </template>
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
    radial-gradient(ellipse at center, #163a18 0%, #0d1f0f 70%);
  color: var(--textPrimary);
  font-family: var(--fontFamily);
  overflow: hidden;
  position: relative;
  transition: background-color 0.8s, background-image 0.8s;
}

main.timer-expired {
  background-color: var(--warning);
  background-image: radial-gradient(ellipse at center, #a61a1a 0%, #4a0505 70%);
}

/* Flipper container is a viewport that masks the overflow columns. */
.flipper-container-wrapper {
  flex-grow: 1;
  width: 90%;
  max-width: 1200px;
  height: 80vh;
  margin: auto;
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

/* Slide Transition Animations
   When moving forward (currentIndex increases):
   - Items move to the LEFT by one whole pane width + gap (which equals 50% container width).
   When moving backward (currentIndex decreases):
   - We pre-render an item to the left, so we offset the initial translation, and transition to 0.
*/
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
    transform: translateX(calc(-50% - 1rem));
  }
}

/* For backward slide, because we insert an element at the beginning,
   we need to start biased to the left (offset by 50% + gap) and animate back to center (0).
*/
@keyframes slideBackwardAnim {
  0% {
    transform: translateX(calc(-50% - 1rem));
  }
  100% {
    transform: translateX(0);
  }
}

/* Responsive design for tablets portrait and mobile */
@media (max-width: 1024px) {
  .half-pane {
    /* Show one pan per screen on smaller devices */
    flex: 0 0 100%;
    width: 100%;
  }

  /* Since the gap is 2rem, we slide exactly 100% + 2rem to move one whole pane */
  .slide-forward {
    animation-name: slideForwardAnimMobile;
  }

  .slide-backward {
    animation-name: slideBackwardAnimMobile;
  }
}

@keyframes slideForwardAnimMobile {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(-100% - 2rem));
  }
}

@keyframes slideBackwardAnimMobile {
  0% {
    transform: translateX(calc(-100% - 2rem));
  }
  100% {
    transform: translateX(0);
  }
}
</style>
