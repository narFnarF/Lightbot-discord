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
			details: `Hello! I'm **Light Bot**. Request an image by typing \`!light\` in the chat. Like a desk plant, your image is persistant and evolves over time. You can type \`!helpmore\` for additional details. Embrace \`!light\` in your days and reach enlightenment!`,
			// examples: ['join-lightbot']
		});
	}

	async run(msg, args) {
		var replyPromise;
		var userID = msg.author.id;
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

			var myFile = `light ${username} ${userID} ${Date.now()}.png`;
			var size = pl.level + 1;

			var pic = new LightPicture(size, myFile, async (err, res)=>{ // TODO: Promisify this?
				if (err) {
					logger.warn(err);
				} else {
					logger.debug(`Created a picture: ${myFile}`);
					// sendImage(userID, channelID, res.path, res.won);
					replyPromise = await sendImage(msg.author, msg.channel, res.path);
					// deleteMsg(firstReply);
					// logger.debug(`replyPromise: ${replyPromise}`);
					fs.rename(res.path, "previous light.png", (err)=>{
						// logger.debug(`rename`);
						if ( err ) logger.warn(`Could not rename the screenshot ${filepath}: ${err}`);
					});
				}
			});




		} else {
			logger.info("Player "+username+" "+userID+" is not allowed to play at the moment.");
			replyPromise = msg.reply(`Life is too short to be in a state of rush. Your image evolves only every **5 minutes**. Close your eyes, take a deep breath, then try again.`);

		}


		// replyPromise = msg.reply(`blabla `)
		return replyPromise;
	}
};

async function sendImage(author, channel, path) {
	var retProm;
	try {
		retProm = await channel.send(`${author} My message with the attachment.`, { files: [{attachment: path /*, name: 'file.jpg'*/}] });
	} catch (err) {
		logger.error(err);
	}
	logger.debug(`File sent.`);
	return retProm;
}

function deleteImage() {

}

function sendImageOLD(userID, channelID, filepath, won) {
	// logger.info("sendImage")
	if (fs.existsSync(filepath)) { //if the file exists on disk
		bot.uploadFile(
			{
				to: channelID,
				file: filepath,
				message: "<@"+userID+"> Here's your lightshow!"
			}, (err, res) => {
				// Rename the picture file.
				fs.rename(filepath, "previous light.png", (err)=>{
					if ( err ) logger.warn(`Could not rename the screenshot ${filepath}: ${err}`);
				});

				if (!err){
					// Update the time last played now that the player actually received its picture.
					pm.updateLastPlayed(userID);
					announceResult(userID, channelID, won);

				} else {
					logger.warn(`I couldn't upload the file to ${userID}. Maybe because of Discord error?`);
					logger.warn(err);

					bot.sendMessage({to: channelID, message:`<@${userID}> I'm sorry. I couldn't send you the file. I'm not sure why. Maybe a permission issue? Maybe try again in a few minutes?`}, ()=>{
						logger.warn(`Wow... I couldn't even send the sorry message to the player ${userID}! I surrender!`)
					});
				}
			}
		);
	}else{
		logger.error("The screenshot isn't there?!");
		bot.sendMessage({
			to: channelID,
			message: `<@${userID}> Err... sorry, i messed up. Maybe try again in a couple minutes?`
		});
		bot.sendMessage({
			to: pm.adminID,
			message: `Yo! I tried to send their !light picture to ${username} but the picture was missing after creating it. Maybe take a look at the !log?`
		});
	}
}
