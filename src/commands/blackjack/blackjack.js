const { Player, BlackjackGame } = require('./game');
const { isAuthorized } = require('../../services/authorization_service');

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

async function handleCreateLobbyCommand(ctx) {
  const authorized = await isAuthorized(ctx.message.chat.id);
  
  if (!authorized) {
    ctx.reply('You are not authorized to use this command.');
    return;
  }

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

async function handleJoinLobbyCommand(ctx) {
  const authorized = await isAuthorized(ctx.message.chat.id);
  
  if (!authorized) {
    ctx.reply('You are not authorized to use this command.');
    return;
  }

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

async function handleStartGameCommand(ctx) {
  const authorized = await isAuthorized(ctx.message.chat.id);
  
  if (!authorized) {
    ctx.reply('You are not authorized to use this command.');
    return;
  }

  const chatId = ctx.message.chat.id;
  const lobby = lobbies[chatId];
  
  if (lobby && lobby.gameStarted) {
    ctx.reply('A game is already in progress in this lobby. Please wait for the current game to end before starting a new one.');
    return;
  }
  
  if (lobby && lobby.players.length >= 2) {
    lobby.game = new BlackjackGame(lobby.players);
    lobby.game.dealInitialCards();
    lobby.gameStarted = true;
    
    // Announce who's going first
    ctx.reply(`The game has started! ${lobby.game.currentPlayer().name} will go first.`);

    // Announce each player's cards
    lobby.game.players.forEach(player => {
      const cardList = player.displayCards();
      ctx.reply(`${player.name}'s cards: ${cardList}`);
    });

    // Announce the dealer's cards
    const dealerCards = lobby.game.dealer.displayCards();
    ctx.reply(`Dealer's cards: ${dealerCards}`);
  } else {
    ctx.reply('The game cannot start until there are at least two players in the lobby.');
  }
}

async function handleHitCommand(ctx) {
  const authorized = await isAuthorized(ctx.message.chat.id);
  
  if (!authorized) {
    ctx.reply('You are not authorized to use this command.');
    return;
  }

  handlePlayerTurn(ctx, async (ctx, currentPlayer, lobby, chatId) => {
    try {
      // player draws a card
      const card = lobby.game.deck.drawCard();
      currentPlayer.cards.push(card);

      // Check if player has busted
      if (currentPlayer.score > 21) {
        await ctx.reply(`You drew ${card.name} and busted with a score of ${currentPlayer.score}!`);
        endTurn(ctx, chatId);
      } else {
        await ctx.reply(`You drew ${card.name}. Your total score is now ${currentPlayer.score}.`);
      }
    } catch (error) {
      console.error('Error while handling hit command:', error);
    }
  });
}

async function handleStandCommand(ctx) {
  const authorized = await isAuthorized(ctx.message.chat.id);
  
  if (!authorized) {
    ctx.reply('You are not authorized to use this command.');
    return;
  }

  handlePlayerTurn(ctx, async (ctx, currentPlayer, lobby, chatId) => {
    try {
      await ctx.reply(`You stand with a score of ${currentPlayer.score}.`);
      endTurn(ctx, chatId);
    } catch (error) {
      console.error('Error while handling stand command:', error);
    }
  });
}

function resetLobby(chatId) {
  delete lobbies[chatId];
}

async function endTurn(ctx, chatId) {
  const lobby = lobbies[chatId];
  const game = lobby.game;
  game.currentPlayerIndex++;
  if (game.currentPlayerIndex >= game.players.length) {
    // It's the dealer's turn
    while (game.dealer.score < 17) {
      const card = game.deck.drawCard();
      game.dealer.cards.push(card);
      await ctx.reply(`Dealer drew ${card.name}. Dealer's total score is now ${game.dealer.score}.`);
    }
    endGame(ctx, chatId);
  } else {
    const nextPlayer = game.players[game.currentPlayerIndex];
    ctx.reply(`It's now player ${nextPlayer.name}'s turn.`);
  }
}

function endGame(ctx,chatId) {
  const lobby = lobbies[chatId];
  const dealerScore = lobby.game.dealer.score;
  
  if (dealerScore > 21) {
    ctx.reply('Dealer has busted. All remaining players win!');
    return;
  }

  const winners = lobby.game.players
    .filter(player => player.score > dealerScore && player.score <= 21);
  
  if (winners.length === 0) {
    ctx.reply(`Dealer wins with a score of ${dealerScore}!`);
  } else {
    // We have winners
    let winnerNames = winners.map(player => player.name).join(', ');
    ctx.reply(`The winners are: ${winnerNames} with a score higher than dealer's score of ${dealerScore}!`);
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