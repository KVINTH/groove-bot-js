// bot.js
const { Telegraf } = require('telegraf');
const config = require('./config');
const { handleAuthCommand } = require('./commands/auth');
const { handleCalcCommand } = require('./commands/calc');
const { handleQuoteCommand, handleAddQuoteCommand } = require('./commands/quotes');
const { handlePhotoCommand, handleAddPhotoCommand } = require('./commands/photos');
const {
  handleCreateLobby,
  handleJoinLobby,
  handleStartGame,
  handleHit,
  handleStand
} = require('./commands/blackjackHandlers');

const {
  handleStartServerCommand,
  handleStopServerCommand,
  handleCheckServerCommand
} = require('./commands/palworld');

// const {
//   logUser
// } = require('./commands/logUser');

const { authorizationMiddleware } = require('./middleware/authorization');

const bot = new Telegraf(config.telegramBotToken);

// General commands
bot.command('auth', handleAuthCommand);
bot.command('calc', handleCalcCommand);
bot.use(authorizationMiddleware);

// Quote commands
bot.command('quote', handleQuoteCommand);
bot.command('addquote', handleAddQuoteCommand);

// Blackjack commands
bot.command('create', handleCreateLobby);
bot.command('join', handleJoinLobby);
bot.command('start', handleStartGame);
bot.command('hit', handleHit);
bot.command('stand', handleStand);

// photo commands
bot.command('photo', handlePhotoCommand);
bot.command('addphoto', handleAddPhotoCommand);
bot.on('photo', handleAddPhotoCommand);

// Palworld server commands
bot.command('startserver', handleStartServerCommand);
bot.command('stopserver', handleStopServerCommand);
bot.command('checkserver', handleCheckServerCommand);

// bot.on('message', logUser);

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

function launchBot() {
  if (process.env.NODE_ENV === 'production') {
    bot.launch({
      webhook: config.webhook
    });
  } else {
    bot.launch();
  }
};

module.exports = {
  launchBot
};