const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BotSchema = new Schema({
		msg:{
			type: String,
			required: true
		 }
});
module.exports = {
	model: mongoose.model('BotMsg', BotSchema)
};
