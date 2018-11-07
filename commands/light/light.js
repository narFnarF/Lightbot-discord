const commando = require('discord.js-commando');
const path = require('path');
const appRoot = require('app-root-path').toString();
const pm = require(path.join(appRoot, 'PlayerManager.js'));
const logger = require(path.join(appRoot, 'logger.js'));
// const stripIndents = require('common-tags').stripIndents;
// const oneLine = require('common-tags').oneLine;

module.exports = class CommandLight extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'light',
			aliases: ['play'],
			group: 'light',
			memberName: 'light',
			description: "The main command. Receive your personalized image that evolves over time.",
			details: `Hello! I'm **Light Bot**. Request an image by typing \`!light\` in the chat. Like a desk plant, your image is persistant and evolves over time. You can type \`!helpmore\` for additional details. Embrace \`!light\` in your days and reach enlightenment!`,
			// examples: ['join-lightbot']
		});
	}

	async run(msg, args) {
		var replyPromise;
		var userID = msg.authos.id;
		var username = msg.author.username;
		var pl = pm.getOrCreatePlayer(userID, username);

		if (pl.allowedToPlay() /*|| testingMode*/) {
			logger.info(`Player ${username} wants light.`);

			try {
				var firstReply = await msg.reply(`Enlightenment is coming (in about 5 seconds)`);
			} catch (err) {
				logger.warn(`Error while sending the "Enlightenment is coming" message to ${username} (${userID}).`);
				logger.warn(err);
			}

			// pl.updateLastPlayed();


			// pm.writeDBFile();

			var myFile = `light ${username} ${userID} ${Date.now()}.png`
			var size = pl.level + 1

			var pic = new LightPicture(size, myFile, (err, res)=>{
				if (err) {
					logger.warn(err);
				} else {
					// logger.info(`Created a picture: ${myFile}`);
					sendImage(userID, channelID, res.path, res.won);
					deleteMsg(firstReply);
				}
			});




		} else {
			logger.info("Player "+username+" "+userID+" is not allowed to play at the moment.");
			replyPromise = msg.reply(`Life is too short to be in a state of rush. Your image evolves only every **5 minutes**. Close your eyes, take a deep breath, then try again.`);

		}


		replyPromise = msg.reply(`blabla `)
		return replyPromise;
	}
};


function lightCommand(userID, channelID, username) {



}
