import { ref, computed, onMounted, onUnmounted } from 'vue'
import { FLIPPER_INTERVAL_MS, RESUME_DELAY_MS } from '../config/constants.js'

export function useFlipper(pages) {
  const currentIndex = ref(0)
  const isPaused = ref(false)
  const msRemaining = ref(FLIPPER_INTERVAL_MS)
  const autoResumeMsRemaining = ref(0)

  let countdownIntervalId = null
  let touchStartX = 0
  let touchStartY = 0
  let lastTap = 0

  // --- Precise tick loop ---
  const startPreciseInterval = () => {
    let lastTime = Date.now()
    countdownIntervalId = setInterval(() => {
      const now = Date.now()
      const delta = now - lastTime
      lastTime = now

      if (!isPaused.value) {
        msRemaining.value = Math.max(0, msRemaining.value - delta)
        if (msRemaining.value <= 0) {
          nextPage()
        }
      }

      if (autoResumeMsRemaining.value > 0) {
        autoResumeMsRemaining.value = Math.max(0, autoResumeMsRemaining.value - delta)
        if (autoResumeMsRemaining.value <= 0) {
          isPaused.value = false
          msRemaining.value = FLIPPER_INTERVAL_MS
        }
      }
    }, 100)
  }

  const stopPreciseInterval = () => {
    if (countdownIntervalId) {
      clearInterval(countdownIntervalId)
      countdownIntervalId = null
    }
  }

  // --- Navigation ---
  const nextPage = () => {
    currentIndex.value = (currentIndex.value + 1) % pages.length
    msRemaining.value = FLIPPER_INTERVAL_MS
  }

  const prevPage = () => {
    currentIndex.value = (currentIndex.value - 1 + pages.length) % pages.length
    msRemaining.value = FLIPPER_INTERVAL_MS
  }

  // --- State modifiers ---
  const triggerUserInterruptedState = () => {
    isPaused.value = true
    autoResumeMsRemaining.value = RESUME_DELAY_MS
  }

  const handlePageLeft = () => {
    triggerUserInterruptedState()
    prevPage()
  }

  const handlePageRight = () => {
    triggerUserInterruptedState()
    nextPage()
  }

  const togglePlayPause = () => {
    if (isPaused.value && autoResumeMsRemaining.value === 0) {
      isPaused.value = false
      msRemaining.value = FLIPPER_INTERVAL_MS
    } else {
      triggerUserInterruptedState()
    }
  }

  const restartFlipping = () => {
    isPaused.value = false
    autoResumeMsRemaining.value = 0
    nextPage()
  }

  // --- Event handlers ---
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      handlePageRight()
    } else if (e.key === 'ArrowLeft') {
      handlePageLeft()
    } else if (e.key === ' ') {
      e.preventDefault()
      togglePlayPause()
    }
  }

  const handleTouchStart = (e) => {
    touchStartX = e.touches[0].clientX
    touchStartY = e.touches[0].clientY
  }

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX
    const touchEndY = e.changedTouches[0].clientY
    const diffX = touchEndX - touchStartX
    const diffY = touchEndY - touchStartY

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      diffX > 0 ? handlePageLeft() : handlePageRight()
    }
  }

  const handleDoubleTap = () => {
    const now = Date.now()
    if (now - lastTap < 300) {
      togglePlayPause()
    }
    lastTap = now
  }

  // --- Computed ---
  const secondsRemaining = computed(() => Math.ceil(msRemaining.value / 1000))
  const autoResumeSecondsRemaining = computed(() => Math.ceil(autoResumeMsRemaining.value / 1000))

  // --- Lifecycle ---
  onMounted(() => {
    startPreciseInterval()
    window.addEventListener('keydown', handleKeyDown)
  })

  onUnmounted(() => {
    stopPreciseInterval()
    window.removeEventListener('keydown', handleKeyDown)
  })

  return {
    currentIndex,
    isPaused,
    msRemaining,
    autoResumeMsRemaining,
    secondsRemaining,
    autoResumeSecondsRemaining,
    handlePageLeft,
    handlePageRight,
    togglePlayPause,
    restartFlipping,
    handleKeyDown,
    handleTouchStart,
    handleTouchEnd,
    handleDoubleTap,
  }
}
