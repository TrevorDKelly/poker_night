<template>
  <div class="flipper-panel">
    <div class="panel-header">
      <h2 class="panel-title">🪙 Chip Values</h2>
    </div>
    <div class="chips-container">
      <div v-for="chip in chips" :key="chip.color" class="chip-row">
        <div class="chip-col col-img">
          <img :src="chip.image" :alt="chip.color" class="chip-img" />
        </div>
        <div class="chip-col col-color">
          <span class="capitalize color-name">{{ chip.color }}</span>
        </div>
        <div class="chip-col col-value">
          <span class="chip-val">{{ chip.value }}</span>
        </div>
      </div>
    </div>

    <div class="blinds-card">
      <div class="blinds-card-header">
        <span class="card-icon">🃏</span>
        <h3 class="card-title">Blinds</h3>
      </div>
      <div class="blinds-display-row">
        <div class="blind-slot-vertical">
          <span class="blind-name-top">Small Blind</span>
          <div class="blind-bottom">
            <div class="chip-image-container">
              <img :src="whiteChip" class="single-chip" alt="White Chip" />
            </div>
            <span class="blind-amt">10</span>
          </div>
        </div>

        <div class="blinds-sep">
          <span class="sep-line-full"></span>
        </div>

        <div class="blind-slot-vertical">
          <span class="blind-name-top">Big Blind</span>
          <div class="blind-bottom">
            <div class="chip-image-container double-stack">
              <img :src="whiteChip" class="stack-chip chip-back" alt="White Chip" />
              <img :src="whiteChip" class="stack-chip chip-front" alt="White Chip" />
            </div>
            <span class="blind-amt highlight">20</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import whiteChip from '../../assets/white_chip.png'
import redChip from '../../assets/red_chip.png'
import blueChip from '../../assets/blue_chip.png'
import greenChip from '../../assets/green_chip.png'
import blackChip from '../../assets/black_chip.png'

const chips = [
  { color: 'white', value: 10, image: whiteChip },
  { color: 'red', value: 50, image: redChip },
  { color: 'blue', value: 100, image: blueChip },
  { color: 'green', value: 250, image: greenChip },
  { color: 'black', value: 1000, image: blackChip }
]
</script>

<style scoped>
.chips-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
  min-height: 0;
  gap: clamp(6px, 1.5vh, 16px);
  padding: 0.25rem 0;
  box-sizing: border-box;
}

.chip-row {
  display: flex;
  align-items: center;
  flex: 1;
  min-height: 0;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  padding: clamp(0.25rem, 1vh, 0.75rem) clamp(0.75rem, 2vw, 1.5rem);
  transition: transform 0.15s ease, background-color 0.15s ease, border-color 0.15s ease;
  box-sizing: border-box;
}

.chip-row:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--highlight, rgba(201, 168, 76, 0.4));
  transform: translateY(-2px);
}

.chip-col {
  display: flex;
  align-items: center;
}

.col-img {
  flex: 0 0 25%;
  justify-content: flex-start;
}

.col-color {
  flex: 1;
  justify-content: flex-start;
  padding-left: clamp(0.5rem, 1.5vw, 1.5rem);
}

.col-value {
  flex: 0 0 35%;
  justify-content: flex-end;
}

.chip-img {
  height: clamp(36px, 7.5vh, 90px);
  width: clamp(36px, 7.5vh, 90px);
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.5));
  transition: transform 0.2s;
  display: block;
}

.chip-row:hover .chip-img {
  transform: scale(1.1) rotate(5deg);
}

.capitalize {
  text-transform: capitalize;
}

.color-name {
  color: var(--textPrimary, #f0e6c8);
  font-weight: 500;
  font-size: clamp(1.1rem, 2.3vh, 1.8rem);
  letter-spacing: 0.5px;
}

.chip-val {
  font-family: monospace;
  font-weight: bold;
  color: var(--highlight, #c9a84c);
  font-size: clamp(1.4rem, 3vh, 2.5rem);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.blinds-card {
  margin-top: 1rem;
  background: rgba(0, 0, 0, 0.15);
  border: 1px solid var(--borderSubtle, rgba(201, 168, 76, 0.15));
  border-radius: 12px;
  padding: clamp(0.6rem, 1.4vh, 0.9rem);
}

.blinds-card-header {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.75rem;
}

.card-icon {
  font-size: 1rem;
}

.card-title {
  font-size: 0.85rem;
  font-weight: bold;
  color: var(--highlight, #c9a84c);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
}

.blinds-display-row {
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 0.5rem;
  background: rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  padding: clamp(0.35rem, 1.2vh, 0.75rem) 0.5rem;
}

.blind-slot-vertical {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  flex: 1;
}

.blind-name-top {
  font-size: clamp(0.6rem, 1.2vh, 0.75rem);
  color: var(--textMuted, #7a9e7e);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: bold;
}

.blind-bottom {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5rem;
}

.chip-image-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: clamp(24px, 4vh, 32px);
  height: clamp(24px, 4vh, 32px);
  flex-shrink: 0;
}

.chip-image-container.double-stack {
  position: relative;
  width: clamp(34px, 5.5vh, 46px);
  height: clamp(34px, 5.5vh, 46px);
}

.single-chip,
.stack-chip {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
}

.stack-chip {
  position: absolute;
}

.chip-back {
  transform: translate(-3px, -3px) rotate(-15deg) scale(0.95);
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.6)) brightness(0.85);
}

.chip-front {
  transform: translate(3px, 3px) rotate(5deg);
}

.blind-amt {
  font-size: clamp(1.1rem, 2.5vh, 1.4rem);
  font-weight: 800;
  font-family: monospace;
  color: var(--textPrimary, #f0e6c8);
  line-height: 1;
}

.blind-amt.highlight {
  color: var(--highlight, #c9a84c);
  text-shadow: 0 0 8px rgba(201, 168, 76, 0.4);
}

.blinds-sep {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.sep-line-full {
  display: block;
  width: 1px;
  height: 36px;
  background: var(--borderSubtle, rgba(201, 168, 76, 0.2));
}
</style>
