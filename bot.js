const TelegramBot = require('node-telegram-bot-api');
const token = '382104363:AAGnrMnx0JRWCbb7Mz4rpqisfX72Eu55MZk';
const bot = new TelegramBot(token, { polling: true });
module.exports = bot;