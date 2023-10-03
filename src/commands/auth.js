require('dotenv').config();
const db = require('../database');

function handleAuthCommand(ctx) {
  if (ctx.message.from.id.toString() !== process.env.ADMIN_USER_ID) {
    ctx.reply('Nice try, bucko.');
    return;
  }

  const chatId = ctx.message.chat.id;
  try {
    db.insert({ chat_id: chatId }).into('authorized_chats')
    .then(() => {
      ctx.reply('Chat authorized successfully!');
    })
    .catch(error => {
      console.error('Error authorizing chat:', error);
      ctx.reply('An error occurred while authorizing the chat.');
    });
  } catch (error) {
    console.error('Error authorizing chat:', error);
    ctx.reply('An error occurred while authorizing the chat.');
  }
}

module.exports = {
  handleAuthCommand,
};