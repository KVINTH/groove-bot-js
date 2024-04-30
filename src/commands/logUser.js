const db = require('../database');

async function logUser(ctx) {

  if (ctx.message.from.id === '37922497') {
    ctx.reply('Why are you gay?');
  }
  
  try {
    const user = await db.select('telegram_id')
      .from('users')
      .where('telegram_id', ctx.message.from.id)
      .first();
    
    if (user) return;

    db.insert({ 
        telegram_id: ctx.message.from.id, 
        username: ctx.message.from.username, 
        first_name: ctx.message.from.first_name,
        last_name: ctx.message.from.last_name
      })
      .into('users')
      .catch(error => {
        console.error('Error logging user:', error);
      });
  }
  catch (error) {
    console.error('Error logging user');
  }
}

module.exports = {
  logUser
}

