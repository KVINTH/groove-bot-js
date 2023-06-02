const { Player, BlackjackGame } = require('./game');

const lobbies = {};

// Helper function to handle the common logic in handleHitCommand and handleStandCommand
function handlePlayerTurn(ctx, action) {
  const chatId = ctx.message.chat.id;
  const lobby = lobbies[chatId];
  
  if (lobby && lobby.gameStarted) {
    const playerId = ctx.from.id;
    const currentPlayer = lobby.game.currentPlayer();

    // check if it's the player's turn
    if (currentPlayer.id === playerId) {
      // perform the specified action (hit or stand)
      action(ctx, currentPlayer, lobby, chatId);
    } else {
      ctx.reply("It's not your turn yet.");
    }
  } else {
    ctx.reply('The game has not started yet.');
  }
}

function handleCreateLobbyCommand(ctx) {
  const chatId = ctx.message.chat.id;
  if (!lobbies[chatId]) {
    lobbies[chatId] = {
      players: [],
      game: null,
      started: false
    };
    ctx.reply('Lobby has been created!');
  } else {
    ctx.reply('A lobby already exists in this chat.');
  }
}

function handleJoinLobbyCommand(ctx) {
  const chatId = ctx.message.chat.id;
  const lobby = lobbies[chatId];
  
  if (lobby) {
    const userId = ctx.from.id;
    const displayName = ctx.from.username || ctx.from.first_name;
    
    if (!lobby.players.some(player => player.id === userId)) {
      lobby.players.push(new Player(userId, displayName));
      
      // Show the list of players in the lobby
      let playerList = lobby.players.map(player => player.name).join(', ');
      ctx.reply(`Players in the lobby: ${playerList}`);
    } else {
      ctx.reply('You have already joined the lobby.');
    }
  } else {
    ctx.reply('No lobby has been created yet. Use /createlobby to create a lobby.');
  }
}

function handleStartGameCommand(ctx) {
  const chatId = ctx.message.chat.id;
  const lobby = lobbies[chatId];
  
  if (lobby && lobby.players.length >= 2) {
    lobby.game = new BlackjackGame(lobby.players);
    lobby.game.dealInitialCards();
    lobby.gameStarted = true;
    
    // Announce who's going first
    ctx.reply(`The game has started! ${lobby.game.currentPlayer().name} will go first.`);

    // Announce each player's cards
    lobby.game.players.forEach(player => {
      const cardList = player.cards.map(card => card.name).join(', ');
      ctx.reply(`${player.name}'s cards: ${cardList}`);
    });
  } else {
    ctx.reply('The game cannot start until there are at least two players in the lobby.');
  }
}

function handleHitCommand(ctx) {
  handlePlayerTurn(ctx, (ctx, currentPlayer, lobby, chatId) => {
    // player draws a card
    const card = lobby.game.deck.drawCard();
    currentPlayer.cards.push(card);

    // Check if player has busted
    if (currentPlayer.score > 21) {
      ctx.reply(`You drew ${card.name} and busted with a score of ${currentPlayer.score}!`);
      endTurn(ctx, chatId);
    } else {
      ctx.reply(`You drew ${card.name}. Your total score is now ${currentPlayer.score}.`);
    }
  });
}

function handleStandCommand(ctx) {
  handlePlayerTurn(ctx, (ctx, currentPlayer, lobby, chatId) => {
    ctx.reply(`You stand with a score of ${currentPlayer.score}.`);
    endTurn(ctx, chatId);
  });
}

function resetLobby(chatId) {
  const lobby = lobbies[chatId];
  lobby.game = null;
  lobby.players = [];
  lobby.gameStarted = false;
}

function endTurn(ctx, chatId) {
  const lobby = lobbies[chatId];
  const game = lobby.game;
  game.currentPlayerIndex++;
  if (game.currentPlayerIndex >= game.players.length) {
    endGame(ctx, chatId);
  } else {
    const nextPlayer = game.players[game.currentPlayerIndex];
    ctx.reply(`It's now player ${nextPlayer.name}'s turn.`);
  }
}

function endGame(ctx, chatId) {
  const lobby = lobbies[chatId];
  const scores = lobby.game.players
    .filter((player) => player.score <= 21)
    .map((player) => player.score);
  
  if (scores.length === 0) {
    ctx.reply('All players have busted. No one wins!');
    return;
  }

  const highestScore = Math.max(...scores);
  
  // Check if the game ended in a tie
  const winners = lobby.game.players.filter(player => player.score === highestScore);
  
  if (winners.length > 1) {
    // The game ended in a tie
    let winnerNames = winners.map(player => player.name).join(', ');
    ctx.reply(`The game ended in a tie between: ${winnerNames}`);
  } else {
    // We have a single winner
    const winner = winners[0];
    ctx.reply(`${winner.name} is the winner with a score of ${highestScore}!`);
  }

  // Reset the lobby after the game ends
  resetLobby(chatId);
}

module.exports = {
  handleCreateLobbyCommand,
  handleJoinLobbyCommand,
  handleStartGameCommand,
  handleHitCommand,
  handleStandCommand
};