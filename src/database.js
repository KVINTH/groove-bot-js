// database.js
const knex = require('knex');
const config = require('./config');

const db = knex(config.knexConfig);

module.exports = db;