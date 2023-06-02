
const { evaluateEquation } = require('../helpers');

function handleCalcCommand(ctx) {
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