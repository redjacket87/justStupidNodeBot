const bot = require('../../bot');
const dbUtils = require('../../db/utils');

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
        console.dir(`${firstName} ${lastName}: ${receivedMessage}`);

        // Если это комманда игнорируем ее
        if (receivedMessage.indexOf('/') == 0) {
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
}
