// bot.js
const { Telegraf } = require('telegraf');
const config = require('./config');
const { handleQuoteCommand, handleAddQuoteCommand } = require('./commands/quotes');
const { handleCalcCommand } = require('./commands/calc');
const {
  handleCreateLobbyCommand,
  handleJoinLobbyCommand,
  handleStartGameCommand,
  handleHitCommand,
  handleStandCommand
} = require('./commands/blackjack/blackjack');

const bot = new Telegraf(config.telegramBotToken);

bot.command('quote', handleQuoteCommand);
bot.command('addquote', handleAddQuoteCommand);
bot.command('calc', handleCalcCommand);
bot.command('create', handleCreateLobbyCommand);
bot.command('join', handleJoinLobbyCommand);
bot.command('start', handleStartGameCommand);
bot.command('hit', handleHitCommand);
bot.command('stand', handleStandCommand);

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
}

module.exports = {
  launchBot
};