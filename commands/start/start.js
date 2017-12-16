const bot = require('../../bot');

module.exports = () => {
    bot.onText(/\/start/, function(msg) {
        const chatId = msg.chat.id;
        const menu = `Я умею следдующие команды:
                 /погода Погода более чем в 200 000 городов мира. Например /погода Syktyvkar
                        А ещё со мной можно просто говорить, напишите мне что-нибудь`
        bot.sendMessage(chatId, menu);
        bot.sendMessage(286641361, menu);
    });
};
