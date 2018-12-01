const commando = require('discord.js-commando');
const stripIndents = require('common-tags').stripIndents;
// const oneLine = require('common-tags').oneLine;

module.exports = class CommandHelpmore extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'helpmore',
			aliases: ['hello', 'salut', 'bonjour', 'test'],
			group: 'light',
			memberName: 'helpmore',
			description: "More info about the bot.",
			details: `More info about the bot.`,
			// examples: ['join-lightbot']
		});
	}

	async run(msg, args) {

		return msg.reply(`Hello! I'm **Light Bot**. Request an image by typing \`!light\` in the chat. Like a desk plant, your image is persistant and evolves over time. You can type \`!helpmore\` for additional details. Embrace \`!light\` in your days and reach enlightenment!`);
	}
};
