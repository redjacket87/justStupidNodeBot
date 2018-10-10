const bot = require('../../bot');
const dbUtils = require('../../db/utils');
const logger = require('../../logger');
const {listOfCommands} = require('../utils');

/**
 *
 * @param {Array<Object>} result Набор доступных для ответ сообщений из БД
 * @returns {Object} Объект сообщения
 */
const sendMsgFromDb = (result) => {
	const rand = Math.floor(Math.random()*result.length);
	return result[rand];
};

module.exports = () => {
    bot.on('message', (msg) => {
        const {text: receivedMessage} = msg;
        const chatId = msg.chat.id;
        const {first_name: firstName = '', last_name: lastName = ''} = msg.from;
        const isNonAvailableWord = dbUtils.checkCensure(receivedMessage);
        const isCommand = listOfCommands.some((command) => {
            return receivedMessage.indexOf(command) !== -1;
        });
        logger.log('info', `${firstName} ${lastName}: ${receivedMessage}`);

        // Если это известная комманда она будет обработана другим коллбеком
        if (isCommand) {
            return;
        }

        // Если это  неизвестная комманда отправляем на /start
        if (receivedMessage.indexOf('/') == 0) {
            bot.sendMessage(chatId, 'Попробуйте набрать /start для того чтобы узнать что я умею');
            return;
        }

        if (isNonAvailableWord) {
            bot.sendMessage(chatId, 'не надо ругаться(');
            return;
        }

        dbUtils.setUpConnection();

        dbUtils.listMsg()
            .then((result) => {
                const listOfMessages = result.map(({msg}) => msg);
                const hasDouble = dbUtils.checkDouble(listOfMessages, receivedMessage);
                const sendingMsg = sendMsgFromDb(listOfMessages);

                if (!hasDouble){
                    dbUtils.createMsg(msg);
                }

                bot.sendMessage(chatId, sendingMsg);

                dbUtils.closeConnection();
            })
    })
};
