const Deck = require('../models/deck');

describe('Deck', () => {
  test('deck should have 52 unique cards after shuffle', () => {
    const deck = new Deck();
    expect(deck.cards.length).toBe(52);

    const unique = new Set(deck.cards.map(card => card.name));
    expect(unique.size).toBe(52);
  });

  test('draw should remove card from deck', () => {
    const deck = new Deck();
    const card = deck.draw();
    expect(card).toBeDefined();
    expect(deck.cards.length).toBe(51);
  });
});
