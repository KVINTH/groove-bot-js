const Lobby = require('../models/lobby');

class GameManager {
  constructor() {
    this.lobbies = new Map();
  }

  createLobby(chatId) {
    if (this.lobbies.has(chatId)) throw new Error('Lobby already exists for this chat ID');
    const lobby = new Lobby(chatId, () => this.removeLobby(chatId));
    this.lobbies.set(chatId, lobby);
    return lobby;
  }

  getLobby(chatId) {
    return this.lobbies.get(chatId);
  }

  removeLobby(chatId) {
    this.lobbies.delete(chatId);
  }
}

module.exports = new GameManager();