const db = require('../database');

async function handleQuoteCommand(ctx) {
  try {
    // extract text after /quote command
    const inputText = ctx.message.text.split(' ')[1] || '';

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
    const quote = ctx.message.text.split(' ')[1] || '';

    if (ctx.message.reply_to_message) {
      quote = `"${ctx.message.reply_to_message.text}" - ${ctx.message.reply_to_message.from.first_name} ${ctx.message.reply_to_message.from.last_name}`;
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