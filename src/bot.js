// bot.js
const { Telegraf } = require('telegraf');
const config = require('./config');
const { handleAuthCommand } = require('./commands/auth');
const { handleCalcCommand } = require('./commands/calc');
const { handleQuoteCommand, handleAddQuoteCommand } = require('./commands/quotes');
const { handlePhotoCommand, handleAddPhotoCommand } = require('./commands/photos');
const {
  handleCreateLobbyCommand,
  handleJoinLobbyCommand,
  handleStartGameCommand,
  handleHitCommand,
  handleStandCommand
} = require('./commands/blackjack/blackjack');

const {
  handleStartServerCommand,
  handleStopServerCommand,
  handleCheckServerCommand
} = require('./commands/palworld');

const {
  logUser
} = require('./commands/logUser');

const { authorizationMiddleware } = require('./middleware/authorization');

const bot = new Telegraf(config.telegramBotToken);
bot.command('auth', handleAuthCommand);

bot.use(authorizationMiddleware);

bot.command('quote', handleQuoteCommand);
bot.command('addquote', handleAddQuoteCommand);
bot.command('calc', handleCalcCommand);
bot.command('create', handleCreateLobbyCommand);
bot.command('join', handleJoinLobbyCommand);
bot.command('start', handleStartGameCommand);
bot.command('hit', handleHitCommand);
bot.command('stand', handleStandCommand);
bot.command('photo', handlePhotoCommand);
bot.command('addphoto', (ctx) => {
  ctx.reply('Send me a photo with the caption /addphoto "Your Caption" to add it to my database!');
});

bot.on('photo', handleAddPhotoCommand);
bot.command('startserver', handleStartServerCommand);
bot.command('stopserver', handleStopServerCommand);
bot.command('checkserver', handleCheckServerCommand);

bot.on('message', logUser);

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