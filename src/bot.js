// bot.js
const { Telegraf } = require('telegraf');
const config = require('./config');
const { handleQuoteCommand, handleAddQuoteCommand } = require('./commands/quotes');
const { handleCalcCommand } = require('./commands/calc');

const bot = new Telegraf(config.telegramBotToken);

bot.command('quote', handleQuoteCommand);
bot.command('addquote', handleAddQuoteCommand);
bot.command('calc', handleCalcCommand);

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