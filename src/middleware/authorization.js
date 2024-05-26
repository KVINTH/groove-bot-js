const db = require('../database');

async function authorizationMiddleware(ctx, next) {
  if (!ctx.message.chat) {
    console.log("No chat found", ctx.message);
    return;
  }

  const authorized = await isAuthorized(ctx.message.chat.id);
  
  if (!authorized) {
    ctx.reply('You are not authorized to use this command.');
    return;
  }

  next();
}

async function isAuthorized(chatId) {
  let isAuthorized = false;
  try {
    const authorizedChatId = await db.select('chat_id')
      .from('authorized_chats')
      .where('chat_id', chatId)
      .first();

    if (authorizedChatId) {
      isAuthorized = true;
    }
    return isAuthorized;
  } catch (error) {
    console.error('Error retrieving authorized chat:', error);
  }
};

module.exports = {
  authorizationMiddleware,
}