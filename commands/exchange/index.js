const bot = require('../../bot.js');
const axios = require('axios');

/**
 * @returns {Promise<Object>}
 */
const getCurrencyExchangeData = async () => {
    let data;
    try {
        data = await axios.get('https://www.cbr-xml-daily.ru/daily_json.js');
    } catch {
        data = null;
    }
    return data;
};

/**
 * @param {Object} currencyList Объект с опциями доступных валют
 * @returns {string}
 */
const getCurrencyList = (currencyList) => {
    const currencyListKeys = Object.keys(currencyList);

    return currencyListKeys.reduce((acc, key) => {
        const {Value, Name, Nominal} = currencyList[key];

        const message = `💱 ${Value.toFixed(2)} рубля за ${Nominal} ${Name} \n`;

        return acc + message;
    }, ``);
};

module.exports =  () => {
    bot.onText(/\/exchange/, async (msg, match) => {
        const currencyExchangeData = await getCurrencyExchangeData();
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
            message = getCurrencyList(currencyList);
        }
        else if (!currency.match(pattern)) {
            message = 'Введите код валюты в правильном формате - 3 латинских буквы, например USD';
        }
        else if (!currencyList[currency]) {
            message = 'Либо это не популярная валюта и ее нет в нашем списке. Либо вы опечатались';
        }
        else {
            const {Value, Name, Nominal} = currencyExchangeData.data.Valute[currency]
            message = `💱 ${Value.toFixed(2)} рубля за ${Nominal} ${Name} \n`;
        }

        bot.sendMessage(chatId, message);
    });
};
