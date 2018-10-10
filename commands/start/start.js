
const {InlineKeyboard} = require('node-telegram-keyboard-wrapper');

const buttonsConfig = require('./buttonConfig');
const bot = require('../../bot');
const {weatherDescription, talking, menuTitle, exchange} = require('../texts.js');
const bitcoinExchangeRate = require('../bitcoin/bitcoinExchangeRate');


module.exports = () => {
    bot.onText(/\/start/, (msg) => {
        const inlineKeyboard = new InlineKeyboard();
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
            case '_exchange_':
                bot.sendMessage(id, exchange);
                break;
            case '_bitcoin_exchange_':
                bitcoinExchangeRate()
                    .then((message) => {
                        bot.sendMessage(id, message);
                    });
                break;
            default:
                break
        }
    })
};
