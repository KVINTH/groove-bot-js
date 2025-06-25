const { Player } = require('../models/player');
const gameManager = require('../managers/gameManager');
const lockManager = require('../managers/lockManager');

function getDisplayName(from) {
  return from.username || from.first_name || `User${from.id}`;
}

async function handleCreateLobby(ctx) {
  const chatId = ctx.chat.id;
  await lockManager.withLock(chatId, async () => {
    try {
      gameManager.createLobby(chatId);
      ctx.reply('✅ Lobby created! Use /join to join the game.');
    } catch (err) {
      ctx.reply('⚠️ ' + err.message);
    }
  });
}

async function handleJoinLobby(ctx) {
  const chatId = ctx.chat.id;
  await lockManager.withLock(chatId, async () => {
    const lobby = gameManager.getLobby(chatId);
    if (!lobby) return ctx.reply('⚠️ No lobby found. Use /create to make one.');

    const userId = ctx.from.id;
    const name = getDisplayName(ctx.from);

    const added = lobby.addPlayer(new Player(userId, name));
    if (!added) {
      ctx.reply('🙅 You have already joined.');
      return;
    }

    const playerList = lobby.players.map(p => p.name).join(', ');
    ctx.reply(`👥 Players: ${playerList}`);
  });
}

async function handleStartGame(ctx) {
  const chatId = ctx.chat.id;
  await lockManager.withLock(chatId, async () => {
    const lobby = gameManager.getLobby(chatId);
    if (!lobby) return ctx.reply('⚠️ No lobby found.');
    if (lobby.gameStarted) return ctx.reply('⚠️ Game already started.');

    try {
      lobby.startGame();
      const game = lobby.game;

      await ctx.reply(`🎮 Game started! First turn: ${game.currentPlayer().name}`);

      for (const player of game.players) {
        await ctx.reply(`${player.name}'s cards: ${player.displayCards()}`);
      }

      await ctx.reply(`Dealer's cards: ${game.dealer.displayCards()}`);
    } catch (err) {
      ctx.reply('⚠️ ' + err.message);
    }
  });
}

async function handleHit(ctx) {
  const chatId = ctx.chat.id;
  await lockManager.withLock(chatId, async () => {
    const lobby = gameManager.getLobby(chatId);
    if (!lobby || !lobby.gameStarted) return ctx.reply('⚠️ No game in progress.');

    const game = lobby.game;
    const playerId = ctx.from.id;
    const currentPlayer = game.currentPlayer();

    if (currentPlayer.id !== playerId) {
      return ctx.reply(`⏳ It's ${currentPlayer.name}'s turn.`);
    }

    const card = game.hit(currentPlayer);
    await ctx.reply(`🃏 You drew ${card.name}. Your score is now ${currentPlayer.score}.`);

    if (currentPlayer.score > 21) {
      await ctx.reply(`💥 You busted!`);
      await advanceTurn(ctx, chatId);
    }
  });
}

async function handleStand(ctx) {
  const chatId = ctx.chat.id;
  await lockManager.withLock(chatId, async () => {
    const lobby = gameManager.getLobby(chatId);
    if (!lobby || !lobby.gameStarted) return ctx.reply('⚠️ No game in progress.');

    const game = lobby.game;
    const playerId = ctx.from.id;
    const currentPlayer = game.currentPlayer();

    if (currentPlayer.id !== playerId) {
      return ctx.reply(`⏳ It's ${currentPlayer.name}'s turn.`);
    }

    await ctx.reply(`🛑 You stand at ${currentPlayer.score}.`);
    await advanceTurn(ctx, chatId);
  });
}

async function advanceTurn(ctx, chatId) {
  const lobby = gameManager.getLobby(chatId);
  const game = lobby.game;

  const over = game.stand();
  if (!over) {
    const nextPlayer = game.currentPlayer();
    await ctx.reply(`👉 It's now ${nextPlayer.name}'s turn.`);
    return;
  }

  game.playDealer();
  await ctx.reply(`🤖 Dealer's final cards: ${game.dealer.displayCards()} (${game.dealer.score})`);

  const winners = game.getWinners();
  if (winners.length === 0) {
    await ctx.reply(`😔 Dealer wins.`);
  } else {
    const winnerNames = winners.map(w => w.name).join(', ');
    await ctx.reply(`🎉 Winner(s): ${winnerNames}`);
  }

  lobby.endGame();
}

module.exports = {
  handleCreateLobby,
  handleJoinLobby,
  handleStartGame,
  handleHit,
  handleStand
};
