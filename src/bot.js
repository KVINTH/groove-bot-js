require('dotenv').config();
const { Telegraf } = require('telegraf');
const knex = require('knex');
const math = require('mathjs');

// Load environment variables
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const NODE_ENV = process.env.NODE_ENV;

// Create Telegraf bot instance
const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

// Set the webhook URL to listen on 0.0.0.0 in production
bot.telegram.setWebhook('https://groove-bot-js-production.up.railway.app/path', {
  source: '0.0.0.0',
});

// Connect to the database
const db = knex(require('../knexfile')[NODE_ENV]);

// Handle the /quote command
bot.command('quote', async (ctx) => {
  try {
    const [quote] = await db.select('quote').from('quotes').orderByRaw('RANDOM()').limit(1);
    if (quote) {
      ctx.reply(quote.quote);
    } else {
      ctx.reply('No quotes available.');
    }
  } catch (error) {
    console.error('Error retrieving quote:', error);
    ctx.reply('An error occurred while retrieving a quote.');
  }
});

// Handle the /addquote command
bot.command('addquote', async (ctx) => {
  try {
    const quote = ctx.message.text.substring(10).trim(); // Extract the quote text
    if (quote) {
      await db.insert({ quote }).into('quotes');
      ctx.reply('Quote added successfully!');
    } else {
      ctx.reply('Please provide a valid quote.');
    }
  } catch (error) {
    console.error('Error adding quote:', error);
    ctx.reply('An error occurred while adding the quote.');
  }
});

// Handle the /calc command
bot.command('calc', (ctx) => {
  try {
    const equation = ctx.message.text.substring(6).trim(); // Extract the equation
    const result = math.evaluate(equation);
    ctx.reply(`Result: ${result}`);
  } catch (error) {
    console.error('Error evaluating equation:', error);
    ctx.reply('An error occurred while evaluating the equation.');
  }
});

// Start the bot
bot.startWebhook('/path', null, process.env.PORT || 3000);
