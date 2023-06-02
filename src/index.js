// index.js
const { launchBot } = require('./bot');

// Start the bot
launchBot();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));