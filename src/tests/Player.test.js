const Player = require('../models/player');

describe('Player', () => {
  test('score calculation without aces', () => {
    const player = new Player(1, 'Test');
    player.cards = [{ scoreValue: 10, value: '10' }, { scoreValue: 9, value: '9' }];
    expect(player.score).toBe(19);
  });

  test('score calculation with ace adjustment', () => {
    const player = new Player(1, 'Test');
    player.cards = [{ scoreValue: 11, value: 'A' }, { scoreValue: 10, value: '10' }, { scoreValue: 5, value: '5' }];
    expect(player.score).toBe(16); // A becomes 1
  });

  test('displayCards returns readable string', () => {
    const player = new Player(1, 'Test');
    player.cards = [{ name: '10 of Hearts' }, { name: 'J of Spades' }];
    expect(player.displayCards()).toBe('10 of Hearts, J of Spades');
  });
});
