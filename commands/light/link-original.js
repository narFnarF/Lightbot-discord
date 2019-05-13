const commando = require('discord.js-commando');
// const stripIndents = require('common-tags').stripIndents;
// const oneLine = require('common-tags').oneLine;
const logger = require("../../logger.js");

module.exports = class CommandLinkOriginal extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'link-original',
			aliases: ['link', 'original', 'game'],
			group: 'light',
			memberName: 'link-original',
			description: "To get the URL link to the original version of this game.",
			details: `Get the URL link to the original version of this game.`,
			// examples: ['join-lightbot']
		});
	}

	async run(msg, args) {
		logger.info(`${msg.author.username} requested the link to Light Game (in server "${msg.guild}").`);

		return msg.reply(`You can play the original Light Game here: https://narf.itch.io/light-game `);
	}
};
