const commando = require('discord.js-commando');
const logger = require("../../logger.js");
const pm = require("../../PlayerManager.js");


module.exports = class CommandRelight extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'relight',
			// aliases: ['relight'],
			group: 'light',
			memberName: 'relight',
			description: "List all the admin commands.",
			// details: `List all the admin commands.`,
			hidden: true,  //requires commando 0.11 which is not on npm yet
			// examples: ['join-lightbot']
		});
	}

	async run(msg, args) {
		var userID = msg.author.id;
		var username = msg.author.username;

		if (pm.exists(userID)) { // if player is in DB
			var pl = pm.getPlayer(userID);
			if (pl.level >= pl.endLevel) { // if ready to relight
				pm.relight(userID);

				var rCount = pl.relight;
				var txt = `:heart: :sparkle: :sparkle: :sparkle: Relight! :sparkle: :sparkle: :sparkle: :heart: \nYou have relit ${rCount} time${rCount>1?"s":""}. You have jumped to level ${pl.displayLevel}.`;


				logger.info(`Relight for ${username}: ${rCount} time(s) and level ${pl.level}. (server: "${msg.guild}")`);
				return msg.reply(txt);

			} else { // player has not reached the correct level to relight
				logger.info(`${username} tried to relight but hasn't reached the level required. (server: "${msg.guild}")`);
				return msg.reply(`You are not ready. :waning_crescent_moon: `);
			}
		} else { // players doesn't exist in DB
			logger.info(`${username} tried to relight but is not in playersDB. (server: "${msg.guild}")`);
			return msg.reply(`It seems you never played. Type \`!light\` to start.`);
		}
	}
};
