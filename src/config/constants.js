export const FLIPPER_INTERVAL_MS = secondsToMs(1500) // 3 seconds
export const RESUME_DELAY_MS = minutesToMs(1) // 1 minute delay before auto-resuming
export const TIMER_DURATION_MS = minutesToMs(30) // 30 minutes in milliseconds

export const GRAPH_TIMEPOINT_COUNT = 7 // number of timepoints to show on the net graph

function secondsToMs(seconds) {
  return seconds * 1000
}

function minutesToMs(minutes) {
  return secondsToMs(minutes * 60)
}
