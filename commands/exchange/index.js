const bot = require('../../bot.js');
const {getThirdPartyAPIData} = require('../utils');
const {dailyCurrencyApiUrl} = require('../urls');

/**
 * @param {Object} currencyList Объект с опциями доступных валют
 * @returns {string}
 */
const getFinalMessageByCurrencyList = (currencyList) => {
    const currencyListKeys = Object.keys(currencyList);

    return currencyListKeys.reduce((acc, key) => {
        const {Value, Name, Nominal} = currencyList[key];

        const message = `💱 ${Value.toFixed(2)} рубля за ${Nominal} ${Name}.\n\n`;

        return acc + message;
    }, ``);
};

module.exports =  () => {
    bot.onText(/\/exchange/, async (msg, match) => {
        const currencyExchangeData = await getThirdPartyAPIData(dailyCurrencyApiUrl);
        const chatId = msg.chat.id;
        const {input} = match;
        const currency = input.split(' ')[1];
        const pattern = /[A-Z]{3}/;
        let message;

        if (!currencyExchangeData) {
            bot.sendMessage(chatId, 'Похоже, что сервер упал. Попробуйте еще раз');
            return;
        }

        const currencyList = currencyExchangeData.data.Valute;

        if (!currency) {
            message = getFinalMessageByCurrencyList(currencyList);
        }
        else if (!currency.match(pattern)) {
            message = 'Введите код валюты в правильном формате - 3 латинских буквы, например USD';
        }
        else if (!currencyList[currency]) {
            message = 'Либо это не популярная валюта и ее нет в нашем списке. Либо вы опечатались';
        }
        else {
            const exectCurrencyObject = currencyExchangeData.data.Valute[currency];
            message = getFinalMessageByCurrencyList({currency: exectCurrencyObject})
        }

        bot.sendMessage(chatId, message);
    });
};
