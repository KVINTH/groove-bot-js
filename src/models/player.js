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

module.exports = Player;