
const { evaluateEquation } = require('../helpers');
const { isAuthorized } = require('../services/authorization_service');

async function handleCalcCommand(ctx) {
  const authorized = await isAuthorized(ctx.message.chat.id);
  
  if (!authorized) {
    ctx.reply('You are not authorized to use this command.');
    return;
  }

  try {
    const equation = ctx.message.text.substring(6).trim(); // Extract the equation
    const result = evaluateEquation(equation);
    ctx.reply(`Result: ${result}`);
  } catch (error) {
    console.error('Error evaluating equation:', error);
    ctx.reply('An error occurred while evaluating the equation.');
  }
}

module.exports = {
  handleCalcCommand
};