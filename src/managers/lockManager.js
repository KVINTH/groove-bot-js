class LockManager {
  constructor() {
    this.locks = new Map(); // chatId -> Promise
  }

  async withLock(chatId, fn) {
    const previous = this.locks.get(chatId) || Promise.resolve();
    const newLock = previous.then(() => fn()).catch(() => {}).finally(() => {
      if (this.locks.get(chatId) === newLock) {
        this.locks.delete(chatId);
      }
    });

    this.locks.set(chatId, newLock);
    return newLock;
  }
}

module.exports = new LockManager();
