const commando = require('discord.js-commando');
const path = require('path');
const appRoot = require('app-root-path').toString();
const pm = require(path.join(appRoot, 'PlayerManager.js'));
const logger = require(path.join(appRoot, 'logger.js'));
const LightPicture = require(path.join(appRoot, 'LightPicture', 'LightPicture.js'));
const fs = require('fs');
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
			details: `Hello! I'm **Light Bot**. Request an image by typing \`!light\` in the chat. Like a desk plant, your image is persistant and evolves over time. You can type \`!helpmore\` for additional details. Embrace \`!light\` in your days and reach enlightenment!`, // TODO: add !helpmore command or remove this sentence.
			// examples: ['join-lightbot']
		});
	}

	async run(msg, args) {
		var replyPromise;
		var userID = msg.author.id;
		var username = msg.author.username;
		var pl = pm.getOrCreatePlayer(userID, username);
		const noWaitingCheat = false; // If true, you don't have to wait 5 minutes.

		if (pl.allowedToPlay() || noWaitingCheat) {
			logger.info(`Player ${username} wants light.`);

			try {
				var firstReply = await msg.reply(`Enlightenment is coming (in about 5 seconds)`);
			} catch (err) {
				logger.warn(`Error while sending the "Enlightenment is coming" message to ${username} (${userID}).`);
				logger.warn(err);
			}

			
			var myFile = `light ${username} ${userID} ${Date.now()}.png`;
			var size = pl.level + 1;

			var pic = new LightPicture(size, myFile, async (err, res)=>{ // TODO: Promisify this?
				if (err) {
					logger.warn(err);
				} else {
					logger.debug(`Created a picture: ${res.path}`);

					var errorHappened = false;
					try {
						replyPromise = await sendImage(msg.author, msg.channel, res.path);
					} catch (err) {
						errorHappened = true;
					}

					fs.rename(res.path, "previous light.png", (err)=>{
						// logger.debug(`rename`);
						if ( err ) logger.warn(`Could not rename the screenshot ${res.path}: ${err}`);
					});

					if (!errorHappened) {
						pm.updateLastPlayed(userID);
						await announceResult(msg.author, msg.channel, res.won); // The level up and save happens here.
					} else {
						logger.error(`There was an error, so i'll skip the leveling up and saving.`);
					}
				}
			});

		} else {
			logger.info("Player "+username+" "+userID+" is not allowed to play at the moment.");
			replyPromise = msg.reply(`Life is too short to be in a state of rush. Your image evolves only every **5 minutes**. Close your eyes, take a deep breath, then try again.`);

		}
		return replyPromise;
	}
};

async function sendImage(author, channel, path) {
	var retProm;
	try {
		retProm = await channel.send(`${author} Here's your lightshow!`, { files: [{attachment: path /*, name: 'file.jpg'*/}] });
		logger.debug(`File sent.`);
		return retProm;
	} catch (err) {
		logger.error(`Error while sending the attached picture to ${author.username}.`);
		channel.send(`${author} Oups! I could not send you your picture. I'm not sure why. This could be a permission issue in this group or a problem with Discord's servers themselves. Maybe try again in a few minutes?`)
		throw new Error(`Error while sending the attached picture.`);
	}
}

async function announceResult(author, channel, win){
	var msg;
	var userID = author.id;

	var pl = pm.getPlayer(userID);
	msg = `You are level ${pl.displayLevel}.`;
	if (win) {
		pm.levelUpPlayer(userID);
		msg += `\n🎇 Enlighted! You've reached **level ${pl.displayLevel}**. 🎇`;
	}
	if (pl.level < pl.endLevel){
		msg += " I wonder what your next image will look like...";
	}

	if (!win && pl.level >=4 && pl.level < pl.endLevel) {
		msg += "\nYou're getting good at this. Can you tell us what you see in this picture?"
	}

	if (pl.level >= pl.endLevel) {
		msg += "\nYou are ready! _You aaaarrrreeee reaaaaddyyyyyy!_ :new_moon: :waning_crescent_moon: :last_quarter_moon: :waning_gibbous_moon: :full_moon: :star2: :full_moon: :star2: :full_moon: `!relight`!!!"
		logger.info(`${pl.name} is ready!`);
	}

	await channel.send(`${author} ${msg}`);
	// bot.sendMessage({to: channelID, message: "<@"+userID+"> "+msg});

	logger.info(`Sent lightshow to ${pl.name} (level ${pl.level}, won: ${win}).`);
}
