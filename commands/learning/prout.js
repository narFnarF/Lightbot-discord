const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const logger = require("../../logger.js");

module.exports = class ProutCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'prout',
			aliases: ['prout'],
			group: 'learning',
			memberName: 'prout',
			description: "For curious cats.",
			details: oneLine`
				detailes description
				aaa
				bbb
				prout!
				Yay!`,
			examples: ['prout'],
		});
	}

	async run(msg, args) {
		logger.info(`${msg.author.username} a pété! 💩 (in server "${msg.guild.name}").`);
		// const total = args.numbers.reduce((prev, arg) => prev + parseFloat(arg), 0);
		// return msg.reply(`${args.numbers.join(' + ')} = **${total}**`);
		// console.log(`yo ${msg.author}`);
		// var reply = msg.reply();
		return msg.channel.send(`Attention tout le monde! ${msg.author} a pété! Ça va sentir! 💩 `)
		// console.log("après");
		// return reply;
	}
};
