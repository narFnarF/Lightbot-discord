const commando = require('discord.js-commando');
const stripIndents = require('common-tags').stripIndents;
// const oneLine = require('common-tags').oneLine;
const logger = require("../../logger.js");

module.exports = class CommandJoinLightbot extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'join-lightbot',
			aliases: ['join', 'join-light', 'discord', 'join-discord'],
			group: 'light',
			memberName: 'join-lightbot',
			description: "To get an invite to Lightbot's discord community server and get support.",
			details: `Get an invite to Lightbot's discord community server and get support.`,
			// examples: ['join-lightbot']
		});
	}

	async run(msg, args) {
		logger.info(`${msg.author.username} requested the link to the community discord (from server "${msg.guild}").`);

		return msg.reply(stripIndents`Here's the link to join the discord community server around Light Bot. That's a good place to ask questions and get support.
			https://discord.gg/ysDXzdu`);
	}
};
