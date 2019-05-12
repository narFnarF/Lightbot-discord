// const appRoot = require('app-root-path').toString();
// const path = require('path')
const commando = require('discord.js-commando');
const pm = require("../../PlayerManager.js");
const logger = require("../../logger.js");

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
		var returnedPromise;
		const userID = msg.author.id;

		if (pm.exists(userID)) {
			const player = pm.getPlayer(userID);

			if (player.relight) { //player has relit at least once
				var plural = player.relight > 1;

				returnedPromise = msg.reply(`You are level \`${player.displayLevel}\` and have relit \`${player.relight}\` ${plural?"times":"time"}.`);

				logger.info(`${msg.author.username} asked for their level: ${player.level}, relight: ${player.relight} (displayLevel: ${player.displayLevel}).`);


			} else { // player has never relit
				returnedPromise = msg.reply(`You are level \`${player.level}\``);
				logger.info(`${msg.author.username} asked for their level: ${player.level}`);
			}


		} else { //player doesn't exist in the DB
			logger.info(`${msg.author.username} (${msg.author.id}) asked for their level but they never played before.`);
			returnedPromise = msg.reply(`It seems you never played with me before, so you're level **1**. You can type \`!light\` to play.`)
		}
		return returnedPromise;
	}
};
