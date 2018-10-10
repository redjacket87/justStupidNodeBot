const TelegramBot = require('node-telegram-bot-api');
const {token} = require('./config');
const bot = new TelegramBot(token, {polling: true});

module.exports = bot;