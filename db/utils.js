'use strict';
const mongoose = require('mongoose');
const BotMsg = require('./schema').model;
const dbConfig = require('./config');
const censure = require('./censure').censure;
module.exports = {
	setUpConnection(){
		mongoose.connect(`mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.name}`);
	},

	listMsg(){
		return new Promise((resolve, reject) => {
			resolve(BotMsg.find());
			reject(new Error('Подключение не установлено'));
		})
	},

	createMsg (msg) {
		const newMsg = new BotMsg({
			msg: msg.text
		});
		return newMsg.save();
	},

	checkDouble(result, msg){
		result = result.filter((item)=>{
			return item.indexOf(msg)!=-1
	 	});
		return result.length ? true :false;
	},

	checkCensure(msg) {
		return msg.toLowerCase().search(censure) != -1;
 	},

	closeConnection() {
		mongoose.connection.close();
	}
};
