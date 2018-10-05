
const {InlineKeyboard} = require('node-telegram-keyboard-wrapper');

const buttonsConfig = require('./buttonConfig');
const bot = require('../../bot');
const {weatherDescription, talking, menuTitle} = require('../texts.js')

const inlineKeyboard = new InlineKeyboard();



module.exports = () => {
    bot.onText(/\/start/, (msg) => {
        const chatId = msg.chat.id;
        buttonsConfig.forEach((row) => inlineKeyboard.addRow(row));
        bot.sendMessage(chatId, menuTitle, inlineKeyboard.export());
    });

    bot.on('callback_query', (query) => {
        const {data, from: {id}} = query;

        switch (data){
            case '_weather_':
                bot.sendMessage(id, weatherDescription);
                break;
            case '_talking_':
                bot.sendMessage(id, talking);
                break;
            default:
                break
        }
    })
};
