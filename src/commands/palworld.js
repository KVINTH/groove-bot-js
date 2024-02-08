
const url = "https://dev.kainth.ca";
const axios = require('axios');

async function handleStartServerCommand(ctx) {
  try {
    ctx.reply('Starting server...');
    const response = await axios.get(`${url}/LaunchApp`);
    ctx.reply(response.data);
  } catch (error) {
    ctx.reply(error.message);
  }
}

async function handleStopServerCommand(ctx) {
  try {
    ctx.reply('Stopping server...');
    const response = await axios.get(`${url}/CloseApp`);
    ctx.reply(response.data);
  } catch (error) {
    ctx.reply(error.message);
  }
}

async function handleCheckServerCommand(ctx) {
  try {
    ctx.reply('Checking server...');
    const response = await axios.get(`${url}/IsAppRunning`);
    ctx.reply(response.data);
  } catch (error) {
    ctx.reply(error.message);
  }
}

module.exports = {
  handleStartServerCommand,
  handleStopServerCommand,
  handleCheckServerCommand
}