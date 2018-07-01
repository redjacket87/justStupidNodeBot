const {Schema, model} = require('mongoose');
const BotSchema = new Schema({
		msg: {
			type: String,
			required: true
		}
});
module.exports = {
	model: model('BotMsg', BotSchema)
};
