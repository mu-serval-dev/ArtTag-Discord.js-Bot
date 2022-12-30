const Events = require('discord.js');

function onHello(msg) {
	if (!msg.author.bot) {
		if (msg.content === 'hi') {
			// msg.reply("Hi!");
			msg.channel.send('Hello!');
		}
		// else if (msg.content === 'time?') {
		// 	const d = new Date();
		// 	msg.channel.send(d.toLocaleTimeString());
		// }
	}
}

exports.onHello = onHello;