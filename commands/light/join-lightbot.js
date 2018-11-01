const commando = require('discord.js-commando');
const stripIndents = require('common-tags').stripIndents;
// const oneLine = require('common-tags').oneLine;

module.exports = class CommandJoinLightbot extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'join-lightbot',
			aliases: ['join', 'join-light', 'discord'],
			group: 'light',
			memberName: 'join-lightbot',
			description: "To get an invite to Lightbot's discord community server and get support.",
			details: `Get an invite to Lightbot's discord community server and get support.`,
			// examples: ['join-lightbot']
		});
	}

	async run(msg, args) {
		// logger.info(username+" requested the link to the community discord.");

		return msg.reply(stripIndents`Here's the link to join the discord community server around Light Bot. That's a good place to ask question and get support.
			https://discord.gg/ysDXzdu`);
	}
};
