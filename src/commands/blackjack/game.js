class BlackjackGame {
  constructor(players) {
    this.deck = new Deck();
    this.players = players;
    this.dealer = new Player('Bot', 'Dealer');
    this.deck.shuffle();
    
    let randomIndex = Math.floor(Math.random() * this.players.length);
    this.currentPlayerIndex = randomIndex;
  }

  dealInitialCards() {
    this.players.forEach(player => {
      player.cards.push(this.deck.drawCard());
      player.cards.push(this.deck.drawCard());
    });
    
    // Deal two cards to the dealer
    this.dealer.cards.push(this.deck.drawCard());
    this.dealer.cards.push(this.deck.drawCard());
  
    // Only reveal one of the dealer's cards
    this.dealer.revealOneCard = true;
  }

  currentPlayer() {
    return this.players[this.currentPlayerIndex];
  }
}

class Deck {
  constructor() {
    this.cards = [];
    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    for (let suit of suits) {
      for (let value of values) {
        this.cards.push(new Card(suit, value));
      }
    }
  }
  
  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  drawCard() {
    return this.cards.pop();
  }
}

class Card {
  constructor(suit, value) {
    this.suit = suit;
    this.value = value;
  }

  get name() {
    return this.value + ' of ' + this.suit;
  }
}

class Player {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.cards = [];
    this.revealOneCard = false;
  }

  displayCards() {
    if (this.revealOneCard) {
      return `${this.cards[0].name}, ?`;
    } else {
      return this.cards.map(card => card.name).join(', ');
    }
  }
  
  get score() {
    let score = 0;
    let aceCount = 0;
    for (let card of this.cards) {
      if (['J', 'Q', 'K'].includes(card.value)) {
        score += 10;
      } else if (card.value === 'A') {
        score += 11;
        aceCount++;
      } else {
        score += parseInt(card.value);
      }
    }
    while (score > 21 && aceCount > 0) {
      score -= 10;
      aceCount--;
    }
    return score;
  }
}

module.exports = {
  BlackjackGame,
  Deck,
  Card,
  Player
}