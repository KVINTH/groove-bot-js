class Card {
  constructor(suit, value) {
    this.suit = suit;
    this.value = value;
  }

  get name() {
    return this.value + ' of ' + this.suit;
  }
}

module.exports = Card;