const Deck = require('./deck');
const Player = require('./player');

class BlackjackGame {
  constructor(players) {
    this.players = players;
    this.dealer = new Player('dealer', 'Dealer');
    this.deck = new Deck();
    this.currentPlayerIndex = 0;
  }

  start() {
    this.deck.shuffle();
    
    this.players.forEach(p => {
      p.cards = [this.deck.draw(), this.deck.draw()];
    });

    this.dealer.cards = [this.deck.draw(), this.deck.draw()];

  }

  currentPlayer() {
    return this.players[this.currentPlayerIndex];
  }

  hit(player) {
    const card = this.deck.draw();
    player.cards.push(card);
    return card;
  }

  stand() {
    this.currentPlayerIndex++;
    return this.isOver();
  }

  isOver() {
    return this.currentPlayerIndex >= this.players.length;
  }

  playDealer() {
    while (this.dealer.score < 17) {
      const card = this.deck.draw();
      this.dealer.cards.push(card);
    }
  }

  getWinners() {
    const dealerScore = this.dealer.score;
    return this.players.filter(player => player.score <= 21 && player.score > dealerScore);
  }
}

module.exports = BlackjackGame;
