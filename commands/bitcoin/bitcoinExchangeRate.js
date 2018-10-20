const {getThirdPartyAPIData} = require('../utils');
const {bitcoinExchangeRate} = require('../urls');


module.exports =  async () => {
    const bitcoinExchangeData = await getThirdPartyAPIData(bitcoinExchangeRate);
    if (!bitcoinExchangeData) {
        return Promise.resolve('Похоже на проблемы со сторонним сервером. попробуйте повторить еще раз.')
    }

    const {last} = bitcoinExchangeData.data.RUB;

    return Promise.resolve(`${last.toFixed(2)}RUB за 1BTC`);
};
