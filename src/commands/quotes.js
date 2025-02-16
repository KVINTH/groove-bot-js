const db = require('../database');
const { getCommandArguments } = require('../helpers');

async function handleQuoteCommand(ctx) {
  try {
    const inputText = getCommandArguments(ctx.message.text);

    let query = db.select('quote').from('quotes');
    if (inputText) {
      query = query.where('quote', 'ilike', `%${inputText}%`);
    }

    query.orderByRaw('RANDOM()').limit(1)
      .then(([quote]) => {
        if (quote) {
          ctx.reply(quote.quote);
        } else {
          ctx.reply('No quotes available.');
        }
      })
      .catch(error => {
        console.error('Error retrieving quote:', error);
        ctx.reply('An error occurred while retrieving a quote.');
      });
  } catch (error) {
    console.error('Error retrieving quote:', error);
    ctx.reply('An error occurred while retrieving a quote.');
  }
}

async function handleAddQuoteCommand(ctx) {
  try {
    let quote = ctx.message.text.split(' ').slice(1).join(' ');

    if (ctx.message.reply_to_message) {
      const firstName = ctx.message.reply_to_message.from.first_name || '';
      const lastName = ctx.message.reply_to_message.from.last_name || '';
      const fullName = `${firstName} ${lastName}`.trim();
      
      quote = ctx.message.reply_to_message.text;

      if (fullName.length > 0) {
        quote = `${quote} - ${fullName}`;
      } else {
        quote = `${quote} - ${ctx.message.reply_to_message.from.username}`;
      }
    }

    if (quote && quote.length > 0) {
      db.insert({ quote }).into('quotes')
        .then(() => {
          ctx.reply('Quote added successfully!');
        })
        .catch(error => {
          console.error('Error adding quote:', error);
          ctx.reply('An error occurred while adding the quote.');
        });
    } else {
      ctx.reply('Please provide a valid quote.');
    }
  } catch (error) {
    console.error('Error adding quote:', error);
    ctx.reply('An error occurred while adding the quote.');
  }
}

module.exports = {
  handleQuoteCommand,
  handleAddQuoteCommand
};