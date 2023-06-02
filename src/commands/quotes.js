const db = require('../database');

function handleQuoteCommand(ctx) {
  try {
    db.select('quote').from('quotes').orderByRaw('RANDOM()').limit(1)
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

function handleAddQuoteCommand(ctx) {
  try {
    const quote = ctx.message.text.substring(10).trim(); // Extract the quote text
    if (quote) {
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