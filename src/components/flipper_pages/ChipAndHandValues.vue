<template>
  <div class="flipper-panel combined-panel">
    <div class="chips-section">
      <div class="panel-header">
        <h2 class="panel-title">Values</h2>
      </div>
      <div class="chips-container">
        <div v-for="chip in chips" :key="chip.color" class="chip-row panel-row">
          <img :src="chip.image" :alt="chip.color" class="chip-img" />
          <span class="chip-val">{{ chip.value }}</span>
        </div>
      </div>
    </div>

    <div class="hands-section">
      <div class="panel-header">
        <h2 class="panel-title">🏆 Poker Hand Rankings</h2>
      </div>

      <div class="hands-container panel-scrollable">
        <div v-for="hand in hands" :key="hand.name" class="hand-row panel-row">
          <!-- Rank -->
          <span class="rank panel-row-number">{{ hand.rank }}</span>
          <span class="hand-name">{{ hand.name }}</span>

          <!-- Cards on the right -->
          <div class="hand-cards">
            <span
              v-for="(card, i) in hand.cards"
              :key="i"
              :class="['card', { red: ['❤️', '♦️'].includes(card.suit), filler: card.filler }]"
            >
              <span class="card-val">{{ card.value }}</span>
              <span class="suit">{{ card.suit }}</span>
            </span>
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

const hands = [
  {
    rank: 1,
    name: 'Royal Flush',
    cards: [
      { value: 'A', suit: '❤️' },
      { value: 'K', suit: '❤️' },
      { value: 'Q', suit: '❤️' },
      { value: 'J', suit: '❤️' },
      { value: '10', suit: '❤️' }
    ]
  },
  {
    rank: 2,
    name: 'Straight Flush',
    cards: [
      { value: '9', suit: '♠️' },
      { value: '8', suit: '♠️' },
      { value: '7', suit: '♠️' },
      { value: '6', suit: '♠️' },
      { value: '5', suit: '♠️' }
    ]
  },
  {
    rank: 3,
    name: 'Four of a Kind',
    cards: [
      { value: 'Q', suit: '♦️' },
      { value: 'Q', suit: '♣️' },
      { value: 'Q', suit: '❤️' },
      { value: 'Q', suit: '♠️' },
      { value: '4', suit: '❤️', filler: true }
    ]
  },
  {
    rank: 4,
    name: 'Full House',
    cards: [
      { value: '10', suit: '❤️' },
      { value: '10', suit: '♣️' },
      { value: '10', suit: '♠️' },
      { value: '9', suit: '♦️' },
      { value: '9', suit: '❤️' }
    ]
  },
  {
    rank: 5,
    name: 'Flush',
    cards: [
      { value: 'A', suit: '♦️' },
      { value: 'J', suit: '♦️' },
      { value: '8', suit: '♦️' },
      { value: '6', suit: '♦️' },
      { value: '2', suit: '♦️' }
    ]
  },
  {
    rank: 6,
    name: 'Straight',
    cards: [
      { value: '8', suit: '❤️' },
      { value: '7', suit: '♣️' },
      { value: '6', suit: '♠️' },
      { value: '5', suit: '♦️' },
      { value: '4', suit: '❤️' }
    ]
  },
  {
    rank: 7,
    name: 'Three of a Kind',
    cards: [
      { value: '7', suit: '❤️' },
      { value: '7', suit: '♣️' },
      { value: '7', suit: '♦️' },
      { value: 'K', suit: '♠️', filler: true },
      { value: '2', suit: '❤️', filler: true }
    ]
  },
  {
    rank: 8,
    name: 'Two Pair',
    cards: [
      { value: 'J', suit: '❤️' },
      { value: 'J', suit: '♣️' },
      { value: '3', suit: '♦️' },
      { value: '3', suit: '♠️' },
      { value: 'A', suit: '❤️', filler: true }
    ]
  },
  {
    rank: 9,
    name: 'One Pair',
    cards: [
      { value: 'A', suit: '❤️' },
      { value: 'A', suit: '♣️' },
      { value: 'K', suit: '♦️', filler: true },
      { value: '10', suit: '♠️', filler: true },
      { value: '5', suit: '❤️', filler: true }
    ]
  },
  {
    rank: 10,
    name: 'High Card',
    cards: [
      { value: 'A', suit: '❤️' },
      { value: 'Q', suit: '♣️', filler: true },
      { value: '9', suit: '♦️', filler: true },
      { value: '7', suit: '♠️', filler: true },
      { value: '4', suit: '❤️', filler: true }
    ]
  }
]
</script>

<style scoped>
.combined-panel {
  flex-direction: row !important;
  gap: 1rem;
}

.chips-section {
  flex: 0 0 25%;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.hands-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.chips-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
  min-height: 0;
  gap: clamp(4px, 1vh, 12px);
  padding: 0.25rem 0;
  box-sizing: border-box;
}

.chip-row {
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex: 1;
  min-height: 0;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  padding: clamp(0.2rem, 1vh, 0.5rem) clamp(0.5rem, 1vw, 1rem);
  box-sizing: border-box;
}

@media (min-width: 1024px) {
  .combined-panel.flipper-panel {
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: stretch;
  }
}

.chip-img {
  height: clamp(30px, 8vh, 100px);
  width: clamp(30px, 8vh, 100px);
  object-fit: contain;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5));
}

.chip-val {
  font-family: monospace;
  font-weight: bold;
  color: var(--highlight, #c9a84c);
  font-size: clamp(1.1rem, 2.2vh, 1.8rem);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.hand-values-column {
  background: var(--bgCard, rgba(26, 46, 28, 0.4));
  border: 1px solid var(--borderSubtle, rgba(201, 168, 76, 0.2));
  border-radius: 12px;
  padding: 0.6rem;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  box-sizing: border-box;
  height: 80vh;
  width: 100%;
}

.hands-container {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  overflow-y: auto;
}

.hand-row {
  justify-content: space-between;
  padding: 0.25rem 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.02);
  flex: 1;
  min-height: 0;
}

.hand-row:hover {
  border-color: var(--borderSubtle);
}

.hand-meta {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 0.15rem;
  min-width: 0;
  text-align: left;
}

.rank {
  font-size: clamp(0.6rem, 1vh, 3rem);
  width: 2.25vh;
  height: 2.25vh;
}

.hand-name {
  flex: 1;
  text-align: left;
  font-size: clamp(0.7rem, 2.2vh, 4rem);
  font-weight: bold;
  color: var(--highlight, #c9a84c);
  white-space: nowrap;
}

.hand-cards {
  display: flex;
  justify-content: flex-end;
  gap: clamp(0.1rem, 0.5vw, 2rem);
  flex-shrink: 0;
  flex:1
}

.card {
  background: #ffffff;
  color: #000000;
  border-radius: 2px;
  width: clamp(30px, 8vw, 36px);
  height: clamp(30px, 8vw, 32px);
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 1px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.3);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.card-val {
  font-size: clamp(0.65rem, 1.4vw, 0.7rem);
  font-weight: 900;
  line-height: 1;
}

.card .suit {
  font-size: clamp(0.55rem, 1.2vw, 0.6rem);
  line-height: 1;
}

.card.red {
  color: #d32f2f;
}

.card.filler {
  opacity: 0.35;
  filter: grayscale(0.5);
}

@media (max-width: 768px) {
  .hand-row {
    padding: 0.2rem 0.4rem;
  }
}

@media (min-width: 1024px) {
  .chips-section {
    position: relative;
    width: 25%;
    height: 100%;
    padding: 1rem 0rem;
    left: 0;
    top: 0;
    transform: none;
    display: flex;
    flex-direction: column;
  }

  .hands-section {
    position: relative;
    margin-left: 0;
    width: 75%;
    height: 100%;
    align-self: stretch;
    background: transparent;
    border: none;
    border-radius: 0;
    padding: 1rem 0rem;
    box-shadow: none;
    display: flex;
    flex-direction: column;
  }

  .hands-section .hands-container {
    padding-bottom: 2rem;
  }
}
</style>
