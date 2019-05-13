const commando = require('discord.js-commando');
const stripIndents = require('common-tags').stripIndents;
// const oneLine = require('common-tags').oneLine;
const logger = require("../../logger.js");

module.exports = class CommandHi extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'hi',
			aliases: ['hello', 'salut', 'bonjour', 'test'],
			group: 'light',
			memberName: 'hi',
			description: "See welcome message. Let Lightbot introduce itself.",
			details: `Let Lightbot introduce itself.`,
			// unknown: true, //requires commando 0.11 which is not on npm yet
			// examples: ['join-lightbot']
		});
	}

	async run(msg, args) {
		logger.info(`${msg.author.username} said !hi in server "${msg.guild}".`);

		return msg.reply(`Hello! I'm **Light Bot**. Request an image by typing \`!light\` in the chat. Like a desk plant, your image is persistant and evolves over time. You can type \`!helpmore\` for additional details. Embrace \`!light\` in your days and reach enlightenment!`);
	}
};
