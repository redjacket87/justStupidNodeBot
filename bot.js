const TelegramBot = require('node-telegram-bot-api');
const token = '382104363:AAHonMgBpUonMyB_Rv0I3f50pW8HH7NXPWI';
const bot = new TelegramBot(token, {polling: true});

module.exports = bot;