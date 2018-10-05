const mongoose = require('mongoose');

const BotSchema = new mongoose.Schema({
		msg: {
			type: String,
			required: true
		}
});

module.exports = {
	model: mongoose.model('BotMsg', BotSchema)
};
