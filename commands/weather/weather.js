const bot = require('../../bot.js');
const axios = require('axios');
const getWeather = (city) => {
	const token = 'c9bafe1029374424545aac18f7641990';
	const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${token}`;
	return axios.get(url);
};

const getCoords = (coord)=>{
	return `Координаты:\n
		Долгота: ${coord.lon}\n
		Широта: ${coord.lat}`
};

const getTemperature = (temp)=>{
	const toCels = (temp - 273.15).toFixed(1);
	return `\nТемпература: ${toCels}С`
};

const getWind = (wind) => {
	const directions = require('./config');
	let direction = '';
	for(let item in directions){
		if(Math.abs(directions[item]-wind.deg) < 22.5 ||
			Math.abs(directions[item] + 360 - wind.deg) < 22.5){
				direction = item
		}
	}
	return `\nВетер: ${direction} ${wind.speed.toFixed(1)}м/c`
};

module.exports = () => {
	bot.onText(/\/погода/, (msg, match) =>{
		const chatId = msg.chat.id;
		const pattern = /[a-z]/;
		let city = '';
		const command = match.input;
		const cityFromCommand = command.split(' ')[1];
			if(cityFromCommand == undefined){
				city = 'saint petersburg';
			}
			else if (!pattern.test(cityFromCommand.toLowerCase())){
				bot.sendMessage(chatId, 'Город пишется латиницей');
				return;
			}
			else{
				city = cityFromCommand;
			}
		getWeather(city)
			.then((result) => {
				const data = result.data;
				const sendingMsg = `${getCoords(data.coord)}
					${getTemperature(data.main.temp)}
					${getWind(data.wind)}`;
				bot.sendMessage(chatId, sendingMsg);
			})
			.catch(()=>{
				const chatId = msg.chat.id;
				bot.sendMessage(chatId, 'что-то пошло не так...\n Проверьте правильность написания города.' +
					'Города пишуться латиницей, без дифиса');
			})
	})
}
