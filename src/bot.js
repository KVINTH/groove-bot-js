require('dotenv').config();
const { Telegraf } = require('telegraf');
const knex = require('knex');
const math = require('mathjs');

// create telegraf bot instance
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// connect to the database
const db = knex(require('../knexfile').development);

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

// // Handle the /convert command
// bot.command('convert', async (ctx) => {
//   try {
//     const params = ctx.message.text.substring(8).trim().split(' ');
//     const [amount, fromCurrency, toCurrency] = params;
//     console.log(params);
//     const rates = await fixer.latest({ base: "CAD", symbols: ["USD"] });
//     console.log(rates);
//     const conversionRate = rates.rates[toCurrency];
//     if (conversionRate) {
//       const convertedAmount = amount * conversionRate;
//       ctx.reply(`${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`);
//     } else {
//       ctx.reply('Invalid currency code(s).');
//     }
//   } catch (error) {
//     console.error('Error converting currency:', error);
//     ctx.reply('An error occurred while converting the currency.');
//   }
// });

// Start the bot
bot.launch({
  webhook: {
    domain: process.env.WEBHOOK_DOMAIN,
    port: process.env.PORT,
    hookPath: process.env.WEBHOOK_PATH,
  }
});