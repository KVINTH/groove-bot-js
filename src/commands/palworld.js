
const url = "https://dev.kainth.ca";

async function handleStartServerCommand(ctx) {
  ctx.reply('Starting server...');
  axios.get(`${url}/LaunchApp`)
    .then(response => ctx.reply(response.data))
    .catch(err => ctx.reply(err.message));
}

async function handleStopServerCommand(ctx) {
  ctx.reply('Stopping server...');
  axios.get(`${url}/CloseApp`)
    .then(response => ctx.reply(response.data))
    .catch(err => ctx.reply(err.message));
}

async function handleCheckServerCommand(ctx) {
  ctx.reply('Checking server...');
  axios.get(`${url}/IsAppRunning`)
    .then(response => ctx.reply(response.data))
    .catch(err => ctx.reply(err.message));
}

module.exports = {
  handleStartServerCommand,
  handleStopServerCommand,
  handleCheckServerCommand
}