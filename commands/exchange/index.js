const bot = require('../../bot.js');
const axios = require('axios');

const getCurrencyExchangeData = async () => {
    let data;
    try {
        data = await axios.get('https://www.cbr-xml-daily.ru/daily_json.js');
    } catch {
        data = null;
    }
    return data;
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
            message = 'Похоже, что сервер упал. Попробуйте еще раз'
        }
        else if (!currency.match(pattern)) {
            message = 'Введите код валюты в правильном формате - 3 латинских буквы, например USD';
        }
        else if (!currencyExchangeData.data.Valute[currency]) {
            message = 'Либо это не популярная валюта и ее нет в нашем списке. Либо вы опечатались';
        }
        else {
            message = currencyExchangeData.data.Valute[currency].Value;
        }

        bot.sendMessage(chatId, message);
    });
};
