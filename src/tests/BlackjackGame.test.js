const BlackjackGame = require('../models/blackjackGame');
const Player = require('../models/player');

function mockPlayers() {
  return [
    new Player(1, 'Alice'),
    new Player(2, 'Bob')
  ];
}

describe('BlackjackGame', () => {
  let game;

  beforeEach(() => {
    const players = mockPlayers();
    game = new BlackjackGame(players);
    game.start();
  });

  test('should deal 2 cards to each player and the dealer', () => {
    for (const player of game.players) {
      expect(player.cards.length).toBe(2);
    }
    expect(game.dealer.cards.length).toBe(2);
  });

  test('currentPlayer returns the first player', () => {
    expect(game.currentPlayer().id).toBe(1);
  });

  test('hit should add a card to current player', () => {
    const player = game.currentPlayer();
    const initialCount = player.cards.length;
    const card = game.hit(player);
    expect(player.cards.length).toBe(initialCount + 1);
    expect(card).toBeDefined();
  });

  test('stand should move to next player', () => {
    const done = game.stand();
    expect(done).toBe(false); // more players left
    expect(game.currentPlayer().id).toBe(2);
  });

  test('stand ends game after all players', () => {
    game.stand(); // Alice
    const done = game.stand(); // Bob
    expect(done).toBe(true);
  });

  test('playDealer should finish dealer’s turn', () => {
    game.stand();
    game.stand();
    game.playDealer();
    expect(game.dealer.score).toBeGreaterThanOrEqual(17);
  });

  test('getWinners identifies winners correctly', () => {
    // manually set scores for test
    game.dealer.cards = [{ scoreValue: 10, value: '10' }, { scoreValue: 6, value: '6' }];
    game.players[0].cards = [{ scoreValue: 10, value: '10' }, { scoreValue: 7, value: '7' }];
    game.players[1].cards = [{ scoreValue: 5, value: '5' }, { scoreValue: 6, value: '6' }];

    const winners = game.getWinners();
    expect(winners.length).toBe(1);
    expect(winners[0].name).toBe('Alice');
  });
});
