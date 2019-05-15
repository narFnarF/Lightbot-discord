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

		return msg.reply(`Admin commands are: \`!log\`, \`!ping\`, \`!prout\`.`);
	}

	sendLog() {
		// logger.debug("I entered in sendLog().")
		var path = pathModule.join(appRoot.toString(), "logs", config.logErrorName);
		bot.uploadFile({
			to: config.backupChannel,
			file: path,
			message: "**The Node log:**"
		}, (err, res)=>{
			if (err){
				logger.warn("I had trouble sending the logs to the backup channel.");
				logger.warn(`Error returned: ${err}`);
			}
		});

		bot.uploadFile({
			to: config.backupChannel,
			file: playersDBPath,
			message: "**The PlayersDB**"
		}, (err, res) => {
			if (err){
				logger.warn("I had trouble sending the playersDB to the backup channel.");
				logger.warn(`Error returned: ${err}`);
			}
		});
	}
};
