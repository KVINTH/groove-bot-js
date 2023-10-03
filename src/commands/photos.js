const db = require('../database');
const { isAuthorized } = require('../services/authorization_service');

async function handlePhotoCommand(ctx) {
  const authorized = await isAuthorized(ctx.message.chat.id);
  
  if (!authorized) {
    ctx.reply('You are not authorized to use this command.');
    return;
  }

  try {
    db.select('file_id', 'caption')
      .from('photos')
      .orderByRaw('RANDOM()')
      .limit(1)
      .then(([photo]) => {
        if (photo) {
          ctx.replyWithPhoto(photo.file_id, { caption: photo.caption });
        } else {
          ctx.reply('No photos available.');
        }
      });
  } catch (error) {
    console.error('Error retrieving photo:', error);
    ctx.reply('An error occurred while retrieving the photo.');
  }
}

async function handleAddPhotoCommand(ctx) {
  const authorized = await isAuthorized(ctx.message.chat.id);
  
  if (!authorized) {
    ctx.reply('You are not authorized to use this command.');
    return;
  }

  try {
    const command = '/addphoto';

    if (!ctx.message.caption) return;
    if (!ctx.message.caption.includes(command)) return;

    const fileId = ctx.message.photo[0].file_id;
    const caption = ctx.message.caption.substring(command.length).trim();

    db.insert({ file_id: fileId, caption }).into('photos')
      .then(() => {
        ctx.reply('Photo added successfully!');
      })
      .catch(error => {
        console.error('Error adding photo:', error);
        ctx.reply('An error occurred while adding the photo.');
      });
    
  } catch (error) {
    console.error('Error adding photo:', error);
    ctx.reply('An error occurred while adding the photo.');
  }
}

module.exports = {
  handlePhotoCommand,
  handleAddPhotoCommand
};
