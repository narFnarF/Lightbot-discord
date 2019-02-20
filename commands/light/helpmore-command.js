const commando = require('discord.js-commando');
const stripIndents = require('common-tags').stripIndents;
// const oneLine = require('common-tags').oneLine;

module.exports = class CommandHelpmore extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'helpmore',
			aliases: ['more'],
			group: 'light',
			memberName: 'helpmore',
			description: "More info about the bot.",
			details: `More info about the bot.`,
			// examples: ['join-lightbot']
		});
	}

	async run(msg, args) {

		return msg.reply(`Placeholder`);
	}
};
