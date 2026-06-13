<template>
  <div class="flipper-panel">
    <div class="panel-header">
      <h2 class="panel-title">🏆 Poker Hand Rankings</h2>
    </div>

    <div class="hands-container panel-scrollable">
      <div v-for="hand in hands" :key="hand.name" class="hand-row panel-row">
        <!-- Rank -->
        <span class="rank panel-row-number">{{ hand.rank }}</span>

        <!-- Name and Description -->
        <div class="hand-meta">
          <span class="hand-name">{{ hand.name }}</span>
          <p class="description">{{ hand.description }}</p>
        </div>

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
</template>

<script setup>
const hands = [
  {
    rank: 1,
    name: 'Royal Flush',
    description: 'A, K, Q, J, 10 of the same suit.',
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
    description: 'Five cards in sequence, all of the same suit.',
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
    description: 'Four cards of the same numerical rank.',
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
    description: 'Three of a kind combined with a pair.',
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
    description: 'Any five cards of the exact same suit, not in sequence.',
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
    description: 'Five numerical cards in sequence, of different suits.',
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
    description: 'Three cards of the same numerical rank.',
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
    description: 'Two different pairs of numerical cards.',
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
    description: 'Two cards of matching numerical rank.',
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
    description: 'Highest card plays when no other hand is made.',
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
  background: rgba(0, 0, 0, 0.15);
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
  font-size: 0.7rem;
  width: 16px;
  height: 16px;
}

.hand-name {
  font-size: 0.85rem;
  font-weight: bold;
  color: var(--highlight, #c9a84c);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.description {
  margin: 0;
  font-size: 0.68rem;
  color: var(--textPrimary, #f0e6c8);
  opacity: 0.75;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.1;
}

.hand-cards {
  display: flex;
  gap: 0.12rem;
  flex-shrink: 0;
}

.card {
  background: #ffffff;
  color: #000000;
  border-radius: 2px;
  width: 36px;
  height: 32px;
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
  font-size: 0.7rem;
  font-weight: 900;
  line-height: 1;
}

.card .suit {
  font-size: 0.6rem;
  line-height: 1;
}

.card.red {
  color: #d32f2f;
}

.card.filler {
  opacity: 0.35;
  filter: grayscale(0.5);
}

@media (max-height: 800px) {
  .card {
    width: 30px;
    height: 30px;
  }
  .card-val { font-size: 0.65rem; }
  .card .suit { font-size: 0.55rem; }
  .description { font-size: 0.6rem; }
}
</style>
