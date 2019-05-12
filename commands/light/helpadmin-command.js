const commando = require('discord.js-commando');
const logger = require("../../logger.js");


module.exports = class CommandHelpmore extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'helpadmin',
			aliases: ['admin'],
			group: 'light-admin',
			memberName: 'helpadmin',
			description: "List all the admin commands.",
			details: `List all the admin commands.`,
			// examples: ['join-lightbot']
		});
	}

	async run(msg, args) {
		logger.info(`List of admin commands requested by ${msg.author.username} (in server "${msg.guild.name}").`);

		return msg.reply(`Admin commands are: \`!log\`, \`!rename <new name>\`, \`!ping\`, \`!prout\`.`);
	}
};
