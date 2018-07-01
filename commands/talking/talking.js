const bot = require('../../bot');
const dbUtils = require('../../db/utils');
const sendMsgFromDb = (result) => {
	const rand = Math.floor(Math.random()*result.length);
	return result[rand];
};

module.exports = () => {
	bot.on('message',  (msg) => {
		const chatId = msg.chat.id;
		if(msg.text.indexOf('/') == 0) {
			return
		}
		const isNonAvailableWord = dbUtils.checkCensure(msg.text);
		if (isNonAvailableWord){
			bot.sendMessage(chatId, 'не надо ругаться(');
			return;
		}
		dbUtils.setUpConnection();
		dbUtils.listMsg()
			.then((result)=>{
				result = result.map((note)=> {
					return note.msg;
				});
				const hasDouble = dbUtils.checkDouble(result, msg.text);
				if (!hasDouble){
					dbUtils.createMsg(msg);
				}
				const sendingMsg = sendMsgFromDb(result);
				const from = msg.from;
				console.dir(from.first_name + '	' + from.last_name + ' ' + msg.text);
				bot.sendMessage(chatId, sendingMsg);
				dbUtils.closeConnection();
			});
		});
};

