const BlackjackGame = require('./blackjackGame');

class Lobby {
  constructor(chatId, onDestroy) {
    this.chatId = chatId;
    this.players = [];
    this.gameStarted = false;
    this.game = null;
    this.timeout = null;
    this.onDestroy = onDestroy;

    this.resetTimeout();
  }

  addPlayer(player) {
    if (this.players.some(p => p.id === player.id)) return false;
    this.players.push(player);
    this.resetTimeout();
    return true;
  }

  startGame() {
    if (this.players.length < 2) throw new Error('At least 2 players required');
    this.gameStarted = true;
    this.game = new BlackjackGame(this.players);
    this.game.start();
    this.clearTimeout();
  }

  endGame() {
    this.players = [];
    this.gameStarted = false;
    this.game = null;
    this.clearTimeout();
    this.onDestroy();
  }

  resetTimeout() {
    this.clearTimeout();
    this.timeout = setTimeout(() => {
      console.log(`Lobby ${this.chatId} timed out.`);
      this.endGame();
    }, 5 * 60 * 1000); // 5 minutes
  }

  clearTimeout() {
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = null;
  }
}

module.exports = Lobby;
