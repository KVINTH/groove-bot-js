const db = require('../database');
const { isAuthorized } = require('../services/authorization_service');

async function handleQuoteCommand(ctx) {
  const authorized = await isAuthorized(ctx.message.chat.id);
  
  if (!authorized) {
    ctx.reply('You are not authorized to use this command.');
    return;
  }

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
  const authorized = await isAuthorized(ctx.message.chat.id);
  
  if (!authorized) {
    ctx.reply('You are not authorized to use this command.');
    return;
  }

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