const commando = require('discord.js-commando');
const stripIndents = require('common-tags').stripIndents;
// const oneLine = require('common-tags').oneLine;
// const path = require('path');
// const appRoot = require('app-root-path').toString();
// const logger = require(path.join(appRoot, 'logger.js'));
const logger = require("../../logger.js");


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
		logger.info(`${msg.author.username} asked for more help (in server "${msg.guild}").`);

		return msg.reply(`Light bot will enlight your day by generating pretty images that are unique to you. Every time you call it with the \`!light\` command, your image will evolve. You can (and should!) call it every 5 minutes, which is how long it takes to generate your new image.\n`+
		"**Commands:**\n"+
		"`!light` Request your image. Watch it grow!\n"+
		"`!level` Tell you your current level.\n"+
		"`!relight` For when you've reached the end.\n"+
		"`!link` To get the URL link to the original version of this game.\n"+
		"`!discord` To get an invite to Lightbot's discord community server and get support.\n"+
		"`!invite` To get an URL to invite Light Bot to your own Discord server.\n"+
		"`!helpadmin` Help about admin commands.\n"
		);
	}
};
