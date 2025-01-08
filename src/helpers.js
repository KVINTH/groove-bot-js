// helpers.js
const math = require('mathjs');

function evaluateEquation(equation) {
  try {
    const result = math.evaluate(equation);
    return result;
  } catch (error) {
    console.error('Error evaluating equation:', error);
    throw new Error('An error occurred while evaluating the equation.');
  }
}

function getCommandArguments(messageText) {
  return messageText.split(' ').slice(1).join(' ').trim();
}

module.exports = {
  evaluateEquation,
  getCommandArguments
};