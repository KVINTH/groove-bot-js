const db = require('../database');
const  { getCommandArguments } = require('../helpers');

async function handlePhotoCommand(ctx) {
  try {
    const inputText = getCommandArguments(ctx.message.text);

    let query = db.select('file_id', 'caption').from('photos');

    // If inputText is provided, filter by caption (case-insensitive)
    if (inputText) {
      query = query.where('caption', 'ilike', `%${inputText}%`);
    }

    query.orderByRaw('RANDOM()').limit(1)
      .then(([photo]) => {
        if (photo) {
          ctx.replyWithPhoto(photo.file_id, { caption: photo.caption });
        } else {
          ctx.reply('No photos matching the caption were found.');
        }
      })
      .catch(error => {
        console.error('Error retrieving photo:', error);
        ctx.reply('An error occurred while retrieving the photo.');
      });
  } catch (error) {
    console.error('Error retrieving photo:', error);
    ctx.reply('An error occurred while retrieving the photo.');
  }
}

async function handleAddPhotoCommand(ctx) {
  try {
    const command = '/addphoto';

    // Ensure the message contains the command explicitly
    if (
      !ctx.message.text?.startsWith(command) && // For messages with text
      !(ctx.message.caption?.startsWith(command)) // For photo captions
    ) {
      return; // Do nothing if the command is not explicitly called
    }

    let fileId;
    let caption = '';

    // Case 1: Replied-to photo
    if (ctx.message.reply_to_message && ctx.message.reply_to_message.photo) {
      fileId = ctx.message.reply_to_message.photo[0].file_id;

      // Combine original photo's caption and any text after the command
      const originalCaption = ctx.message.reply_to_message.caption || '';
      const additionalCaption = ctx.message.text?.substring(command.length).trim() || '';
      caption = [originalCaption, additionalCaption].filter(Boolean).join(' ').trim();
    }
    // Case 2: Photo with or without caption
    else if (ctx.message.photo && ctx.message.caption?.startsWith(command)) {
      fileId = ctx.message.photo[0].file_id;
      // Default to empty caption if no text after the command
      caption = ctx.message.caption.substring(command.length).trim() || '';
    }
    // Invalid case
    else {
      return ctx.reply('Please use this command with a photo or in reply to a photo.');
    }

    // Save to the database
    await db.insert({ file_id: fileId, caption }).into('photos');
    ctx.reply('Photo added successfully!');
  } catch (error) {
    console.error('Error adding photo:', error);
    ctx.reply('An error occurred while adding the photo.');
  }
}

module.exports = {
  handlePhotoCommand,
  handleAddPhotoCommand
};
