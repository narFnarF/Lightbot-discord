const commando = require('discord.js-commando');
// const stripIndents = require('common-tags').stripIndents;
// const oneLine = require('common-tags').oneLine;

module.exports = class CommandAskLevel extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'level',
			aliases: ['my level'],
			group: 'light',
			memberName: 'level',
			description: "Tell you your current level.",
			details: `Tell you your current level.`,
			// examples: ['join-lightbot']
		});
	}

	async run(msg, args) {
		// logger.info(username+" requested the link to Light Game.");

		return msg.reply(`You can play the original Light Game here: https://narf.itch.io/light-game `);
	}
};
