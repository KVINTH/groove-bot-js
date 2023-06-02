// config.js
require('dotenv').config();

const knexConfig = process.env.NODE_ENV === 'production' 
  ? require('../knexfile').production 
  : require('../knexfile').development;

const config = {
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
  knexConfig: knexConfig,
  webhook: {
    domain: process.env.WEBHOOK_DOMAIN,
    port: process.env.PORT
  }
};

module.exports = config;