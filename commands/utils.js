const axios = require('axios');

module.exports = {
    get listOfCommands() {
        return ['/start', '/weather', '/exchange'];
    },

    /**
     * @param {String} url Url запроса
     * @returns {Promise<Object>}
     */
    getThirdPartyAPIData(url) {
        let data;
        try {
            data = axios.get(url);
        } catch {
            data = null;
        }
        return data;
    }
};
