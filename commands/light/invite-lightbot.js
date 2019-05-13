const commando = require('discord.js-commando');
const stripIndents = require('common-tags').stripIndents;
// const oneLine = require('common-tags').oneLine;
const logger = require("../../logger.js");

module.exports = class CommandInviteBot extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'invite-lightbot',
			aliases: ['invite', 'invite-bot'],
			group: 'light',
			memberName: 'invite-lightbot',
			description: "To get an URL to invite Light Bot to your own Discord server.",
			details: `To get an URL to invite Light Bot to your own Discord server.`,
			examples: ['invite-lightbot']
		});
	}

	async run(msg, args) {
		logger.info(`${msg.author.username} requested the invite link (in server "${msg.guild}").`);
		
		return msg.reply(stripIndents`Here's the link to invite Light Bot to your own server. The bot keeps your progression saved between Discord servers. If you're not the server's admin, you can't invite the bot. In that case, you should give the link to the server owner so that they can invite it.
		https://discordapp.com/api/oauth2/authorize?client_id=411618329673990157&permissions=52224&scope=bot`)
	}
};
