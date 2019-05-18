const commando = require('discord.js-commando');
const logger = require("../../logger.js");


module.exports = class CommandHelpadmin extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'logs',
			aliases: ['log'],
			group: 'light-admin',
			memberName: 'logs',
			description: "List all the admin commands.",
			details: `List all the admin commands.`,
			// examples: ['join-lightbot']
		});
	}

	async run(msg, args) {
		logger.info(`Log requested by ${msg.author.username} ${msg.author} (in server "${msg.guild.name}")`);

		// sendLog()

		return msg.reply(`Placeholder reply.`); //TODO
	}

	async sendLog(channel, path) {
		var path = pathModule.join(appRoot.toString(), "logs", config.logErrorName);
		try {
			logger.debug(`sending files`);
			await channel.send(`**The Node log:**`, {files: [{attachment: path}] });
			await channel.send(`**The PlayersDB**`, {files: [{attachment: playersDBPath}] });
			logger.debug(`File sent.`);
		} catch (err) {
			logger.error("I had trouble sending the logs to the backup channel.");
			logger.error(`Error returned: ${err}`);
		}
	}

	
};
