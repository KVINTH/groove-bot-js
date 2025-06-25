const LockManager = require('../managers/lockManager');

describe('LockManager', () => {
  test('executes actions sequentially per chatId', async () => {
    const results = [];

    const promise1 = LockManager.withLock(123, async () => {
      await new Promise(res => setTimeout(res, 50));
      results.push('first');
    });

    const promise2 = LockManager.withLock(123, async () => {
      results.push('second');
    });

    await Promise.all([promise1, promise2]);

    expect(results).toEqual(['first', 'second']);
  });

  test('allows parallel execution for different chatIds', async () => {
    const flags = { one: false, two: false };

    const p1 = LockManager.withLock(1, async () => {
      await new Promise(res => setTimeout(() => {
        flags.one = true;
        res();
      }, 30));
    });

    const p2 = LockManager.withLock(2, async () => {
      await new Promise(res => setTimeout(() => {
        flags.two = true;
        res();
      }, 30));
    });

    await Promise.all([p1, p2]);

    expect(flags.one).toBe(true);
    expect(flags.two).toBe(true);
  });
});
