
const db = require('../database');

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
  isAuthorized,
}