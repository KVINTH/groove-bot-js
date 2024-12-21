const db = require('../database');

async function handlePhotoCommand(ctx) {
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
  try {
    const command = '/addphoto';

    let fileId;
    let caption;

    if (ctx.message.reply_to_message && ctx.message.reply_to_message.photo) {
      fileId = ctx.message.reply_to_message.photo[0].file_id;
      caption = ctx.message.text && ctx.message.text.startsWith(command)
        ? ctx.message.text.substring(command.length).trim()
        : ''; // Default to empty caption if no text
    } else if (ctx.message.photo && ctx.message.caption && ctx.message.caption.startsWith(command)) {
      fileId = ctx.message.photo[0].file_id;
      caption = ctx.message.caption.substring(command.length).trim();
    } else {
      return ctx.reply('Please use this command with a photo or in reply to a photo.');
    }

    // Save to the database
    await db.insert({ file_id: fileId, caption }).into('photos');
    ctx.reply('Photo added successfully!');
  } catch (error) {
    console.error('Error adding photo:', {
      message: error.message,
      stack: error.stack,
      context: ctx.message,
    });
    ctx.reply('An error occurred while adding the photo.');
  }
}

module.exports = {
  handlePhotoCommand,
  handleAddPhotoCommand
};
