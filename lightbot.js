"use strict";

// Dependencies
var Discord = require('discord.io');
var fs = require('fs'); // to write files
var appRoot = require('app-root-path')
var pathModule = require('path')
var logger = require('./logger.js');
var LightPicture = require("./LightPicture/LightPicture.js");
const PlayerManager = require("./PlayerManager.js");

// Config files
var auth = require('./auth.json');
var config = require('./config.json');


// Configurations
const endLevel = 20 // Careful changing this: it'll probably break the color tint. The tint formula would need to be adjusted.

// Instance variables
var bot // the discord bot itself
const playersDBPath = pathModule.join(`${appRoot}`, config.playersDBPath);
// var playersDB // the playersDB
var pm = new PlayerManager("./playersDB copy.json", config.ownerAdmin.discordID);

var intentToExit // If true, the app will exit on disconnections. Otherwise, it will try to reconnect.

// debugging flags
var testingMode = false; // Ignore 5 minutes wait time and run debugging init functions if true
var fakeWin = false; // will always level up if true


function initialize() {
	// playersDB = readPlayerDBJson(); // Initialize the playersDB
	intentToExit = false;

	logger.info("Launching the bot!")

	// Initialize Discord Bot
	bot = new Discord.Client({
		token: auth.token,
		autorun: true
	});

	if (testingMode) {
		runDebuggingAtLaunch()
	}

	setupAutoBackups() // It's not in on.ready because it needs to run only once.
}
initialize()


function runDebuggingAtLaunch() {
	logger.warn("We're running in debug mode.")
	// var id = '000000000fake00000'
	// var channelID = '0000000fake000000'
	// var username = 'fake'

	// id = "214590808727355393";
	// username = "narF"
	// var channelID = "426230699197071370"

	setInterval(function(){
		logger.debug("presenceStatus: "+bot.presenceStatus);
		logger.debug("bot.connected: "+bot.connected);
	}, 15000);
}

function runDebuggingAtLogin(){
	// var id = "214590808727355393";
	// var username = "narF"
	// var channelID = "426230699197071370"
	// logger.debug(`${id} ${username}`)
}

bot.on('ready', function (event) {
	// bot is online. Display in console.
	logger.info('Connected');
	logger.info('I am '+bot.username+'  ('+bot.id+')' );
	// logger.debug(event);
	// console.log(); // blank line return, for pretty

	bot.setPresence({game: {name: "type !light or !help"}})

	if(testingMode) {
		runDebuggingAtLogin()
	}
});


// // Reconnects if bot loses connection / connection is closed
bot.on('disconnect', (errMsg, errCode) => {
	logger.warn(`Disconnected. Code: ${errCode}`);
	logger.warn(`Error message: ${errMsg}`);

	if (intentToExit) {
		// intentional disconnection
		logger.info("Intentional disconnect");
		logger.info("Bye bye!");
		process.exit(); // Exit Node
	}else{
		// unintentional disconnect
		logger.warn("Disconnected unintentionally!");
		bot.connect(); // reconnect();
	}
});


// When a message is received
bot.on('message', function (username, userID, channelID, message, event) {
	// Our bot needs to know if it will execute a command
	// It will listen for messages that will start with `!`
	// TODO: This could be vastly improved to listen to @lightbot or ignore the ! if it's a private DM
	if (message.substring(0, 1) == '!') {
		var args = message.substring(1).split(' ');
		var cmd = args[0];
		args = args.splice(1); //removes the first parameter from the list of parameters

		switch(cmd) {
			case 'ping':
				bot.sendMessage({
					to: channelID,
					message: 'Pong!'
				});
				logger.info('Ping pong with '+username+'!');
			break;

			case 'prout':
				bot.sendMessage({
					to: channelID,
					message: 'Attention tout le monde! <@'+userID+'> a pété! Ça va sentir! 💩 '
				});
				logger.info(username+' a pété! 💩 ');
			break;

			case 'rename':
				var name = args.join(" ");
				renameBot(userID, channelID, name)
			break;

			case 'help':
				bot.sendMessage({
					to: channelID,
					message: "Hello <@"+userID+">. I'm **Light Bot**. Request an image by typing `!light` in the chat. Like a desk plant, your image is persistant and evolves over time. You can type `!helpmore` for additional details. Embrace `!light` in your days and reach enlightenment!"
				});
				logger.info("Help requested by "+username);
			break;

			case 'helpmore':
				bot.sendMessage({
					to: channelID,
					message: `<@${userID}> Light bot will enlight your day by generating pretty images that are unique to you. Every time you call it with the \`!light\` command, your image will evolve. You can (and should!) call it every 5 minutes, which is how long it takes to generate your new image.\n`+
					"**Commands:**\n"+
					"`!light` Request your image. Watch it grow!\n"+
					"`!level` Tell you your current level.\n"+
					"`!relight` For when you've reached the end.\n"+
					"`!link` To get the URL link to the original version of this game.\n"+
					"`!discord` To get an invite to Lightbot's discord community server and get support.\n"+
					"`!invite` To get an URL to invite Light Bot to your own Discord server.\n"+
					"`!helpadmin` Help about admin commands.\n"
				});
				logger.info(`More help requested by ${username}`);
			break;

			case 'helpadmin':
				bot.sendMessage({
					to: channelID,
					message: "<@"+userID+"> Admin commands are: `!log`, `!rename <new name>`, `!ping`, `!prout`."
				});
				logger.info("Admin help requested by "+username);
			break;

			case 'link':
				logger.info(username+" requested link.");
				bot.sendMessage({
					to: channelID,
					message: "<@"+userID+"> You can play the original Light Game here: https://narf.itch.io/light-game "
				});
			break;

			case 'light':
				lightCommand(userID, channelID, username);
			break;

			case 'relight':
				relight(userID, channelID, username);
			break;

			case 'log':
				if (pm.isAdmin(userID)) {
					logger.info(`Log requested by ${username} ${userID}`)
					sendLog()

				} else {
					bot.sendMessage({
						to: channelID,
						message: "<@"+userID+"> You are not my admin. You cannot request logs."
					})
					logger.warn(`${username} ${userID} tried to get logs, but I stopped them.`)
				}
			break;

			case 'level':
				askLevel(userID, username, channelID);
			break;

			case 'invite':
				bot.sendMessage({
					to: channelID,
					message: `<@${userID}> Here's the link to invite Light Bot to your own server. The bot keeps your progression saved between Discord servers. If you're not the server's admin, you can't invite the bot. In that case, you should give the link to the server owner so that they can invite it. \nhttps://discordapp.com/api/oauth2/authorize?client_id=411618329673990157&permissions=52224&scope=bot`
				});
				logger.info(username+" requested the invite link.");
			break;

			case 'join':
			case 'discord':
				bot.sendMessage({
					to: channelID,
					message: `<@${userID}> Here's the link to join the discord community server around Light Bot. That's a good place to ask question and get support. \nhttps://discord.gg/ysDXzdu`
				});
				logger.info(username+" requested the link to the community discord.");
			break;
		}
	}
});


// Control+C signal received: disconnect the bot before exit
process.on("SIGINT", function () {
	console.log(""); // a blank line so that the displayed interupt signal displays nicely (because I'm meticulous like that!)
	logger.info("SIGINT received. Disconnecting bot...");
	intentToExit = true;

	bot.disconnect();
	pm.exit();

	setTimeout(function () {
		logger.warn("Timout on disconnection. Let's quit anyway!");
		process.exit(); // Quit the server
	}, 5000);
});

function lightCommand(userID, channelID, username) {
	var p = pm.getOrCreatePlayer(userID, username);

	if (p.allowedToPlay() || testingMode) {
		logger.info(`Player ${username} wants light.`);
		bot.sendMessage({to: channelID, message: "<@"+userID+"> Enlightenment is coming (in about 5 seconds)"}, (err, res)=>{
			if (!err){ // Do this after the call back, if there's no error
				// p.updateLastPlayed();
				deleteMsgAfterDelay(res.id, channelID, 5)

				// pm.writeDBFile();

				var myFile = `light ${username} ${userID} ${Date.now()}.png`
				var size = p.level + 1

				var pic = new LightPicture(size, myFile, (err, res)=>{
					if (err) {
						logger.warn(err);
					} else {
						// logger.info(`Created a picture: ${myFile}`);
						sendImage(userID, channelID, res.path, res.won);
					}
				});
			} else {
				logger.warn(`Error while sending the "Enlightenment is coming" message to ${username} ${userID}.`)
				logger.warn(err)
			}
		});
	} else {
		logger.info("Player "+username+" "+userID+" is not allowed to play at the moment.")
		bot.sendMessage({to: channelID, message: `<@${userID}> Life is too short to be in a state of rush. Your image evolves only every **5 minutes**. Close your eyes, take a deep breath, then try again.`})
	}
}

function renameBot(userID, channelID, newName) {
	if (pm.isAdmin(userID)) {
		logger.info(`Renaming the bot to: ${newName}`);
		bot.editUserInfo({"username": newName}, (error, response)=>{
			if (error) {
				logger.warn(error);
				bot.sendMessage({
					to: channelID,
					message: "<@"+userID+"> Rename unsuccessful for some reasons... Maybe try again later? Sometime that works."
				});
			}else{
				//TODO send success
				bot.sendMessage({
					to: channelID,
					message: `<@${userID}> Rename successful to ${newName}`
				});
				logger.info("Success.")
			}
		});
	}else {
		logger.info(`${username} tried to change the bot name, but I stopped them.`)
		bot.sendMessage({
			to: channelID,
			message: "<@"+userID+"> You're not my admin. You cannot change my name."
		})
	}
}

// function readPlayerDBJson(){
// 	//returns an object: the entire playersDB!
// 	logger.info("Let's read the DB file!");
// 	var json;
// 	if (fs.existsSync(playersDBPath)) { //if the file exists on disk
// 		//logger.info("The file playersDB.json exists!");
//
// 		//read playersDB.json
// 		var data;
// 		try {
// 			data = fs.readFileSync(playersDBPath, "utf8");
// 		} catch (e) {
// 			logger.warn("The playersDB exists but cannot be read.");
// 			logger.warn(e);
// 			throw "playersDB exists but cannot be read";
// 		}
//
// 		//parse JSON
// 		json = JSON.parse(data);
//
// 		//check if DB is empty
// 		if (!json.hasOwnProperty("players")) {
// 			json.players = {};
// 			logger.warn("The DB was missing it's player node, but we recreated it.");
// 		}
// 	}else{
// 		logger.warn("File 'playersDB.json' doesn't exists, but we're going to create it!");
// 		json = {
// 			players:{},
// 			admin:{ "example name": "000000exampleID0000"}
// 		};
// 	}
// 	return json;
// }

// function registerPlayerInDB(userID, username) {
// 	// Create the player in the DB if inexistant.
// 	// If it exist, make sure it has all the correct properties.
// 	// Also update the player's name in the DB.
//
// 	if (playersDB.players.hasOwnProperty(userID)){ //if player already exist
// 		// logger.debug("Found player "+username+" "+userID);
// 		playersDB.players[userID].username = username; // always update the player's name in the DB
//
// 		//check if it's missing any values:
// 		if (!playersDB.players[userID].hasOwnProperty("level")) { //missing level
// 			playersDB.players[userID].level = 1;
// 			logger.warn(userID+" was missing it's level so it was set to 1.");
// 		}
// 		if (!playersDB.players[userID].hasOwnProperty("win")) { //missing win
// 			playersDB.players[userID].win = false;
// 			logger.warn(userID+" was missing it's win state so it was set to false.");
// 		}
// 		if (!playersDB.players[userID].hasOwnProperty("lastPlayed")) { //missing lastPlayed timestamp
// 			playersDB.players[userID].lastPlayed = 0;
// 			logger.warn(userID+" was missing it's lastPlayed timestamp so it was set to 0.");
// 		}
// 	}else{
// 		logger.info(username+" "+userID+" was not in the playersDB. But we're going to add it!")
// 		playersDB.players[userID] = {
// 			"username": username,
// 			"level": 1,
// 			"win": false,
// 			"lastPlayed": 0
// 		};
// 	}
// 	// logger.debug("Finished registering player "+username+" "+userID+" data "+JSON.stringify(playersDB.players[userID]));
// 	savePlayersDB();
// }

// function savePlayersDB() {
// 	//write playersDB.json
// 	var beautifulPlayersDB = JSON.stringify(playersDB, null, 4);
// 	fs.writeFile(playersDBPath, beautifulPlayersDB, (err)=>{
// 		if (err) {
// 			logger.warn("Could not write playersDB.json on disk.");
// 			logger.warn(e);
// 		} else {
// 			// logger.debug("Saved the DB");
// 		}
// 	});
// }

function displayLevel(user) { // TODO : Move this inside Player.js... but would require Player to know about endLevel
	// params:
	// user: Player

	if (user.relight) {
		return user.level+(user.relight*endLevel);
	} else {
		return user.level;
	}
}

function announceResult(userID, channelID, won){
	var msg;
	var win = (won || fakeWin); // if fakeWin is activated, this is always true

	var p = pm.getPlayer(userID);
	msg = `You are level ${displayLevel(p)}.`;
	if (win) {
		pm.levelUpPlayer(userID);
		msg += `\n🎇 Enlighted! You've reached **level ${displayLevel(p)}**. 🎇`;
	}
	if (p.level < endLevel){
		msg += " I wonder what your next image will look like...";
	}

	if (!win && p.level >=4 && p.level < endLevel) {
		msg += "\nYou're getting good at this. Can you tell us what you see in this picture?"
	}

	if (p.level >= endLevel) {
		msg += "\nYou are ready! _You aaaarrrreeee reaaaaddyyyyyy!_ :new_moon: :waning_crescent_moon: :last_quarter_moon: :waning_gibbous_moon: :full_moon: :star2: :full_moon: :star2: :full_moon: `!relight`!!!"
		logger.info(`${p.name} is ready!`);
	}

	bot.sendMessage({to: channelID, message: "<@"+userID+"> "+msg});
	logger.info(`Sent lightshow to ${p.name} (level ${p.level}, won: ${win}).`);
}

function deleteMsgAfterDelay(msgID, chID, delayInSeconds) {
	// logger.debug("msgID"+msgID+" channel"+chID+" delayInSeconds"+delayInSeconds)
	setTimeout(function () {
		bot.deleteMessage({
			channelID: chID,
			messageID: msgID
		}, function (error, result) {
			if (error) {
				logger.warn(error)
			}
		})
	}, delayInSeconds*1000)
}

// function doLevelUp(userID) {
// 	// Do the level up data modifications inside playersDB
// 	playersDB.players[userID].level++;
// 	playersDB.players[userID].win = false;
// 	savePlayersDB(); // write playersDB to file playersDB.json
// }

function relight(userID, channelID, username) {
	if (pm.exists(userID)) { // if player is in DB
		var pl = pm.getPlayer(userID);
		// var lv = p.level;
		if (pl.level >= endLevel) { // if ready to relight
			// if (!playersDB.players[userID].relight) { // if player never relit
			// 	playersDB.players[userID].relight = 0;
			// }
			// pl.increaseRelightCount();
			pm.relight(userID);
			// playersDB.players[userID].relight++;
			// playersDB.players[userID].level = 1;

			var rCount = pl.relight;
			var txt = `<@${userID}> :heart: :sparkle: :sparkle: :sparkle: Relight! :sparkle: :sparkle: :sparkle: :heart: \nYou have relit ${rCount} time${rCount>1?"s":""}. You have jumped to level ${displayLevel(pl)}.`;
			bot.sendMessage({to: channelID, message: txt});
			logger.info(`Relight for ${username}: ${rCount} time(s) and level ${pl.level}.`);

		} else { // player has not reached the correct level to relight
			logger.info(username+" tried to relight but hasn't reached the level required.");
			bot.sendMessage({to: channelID, message: `<@${userID}> You are not ready. :waning_crescent_moon: `});
		}
	} else { // players doesn't exist in DB
		bot.sendMessage({to: channelID, message: `<@${userID}> It seems you never played. Type \`!light\` to start.`});
		logger.info(username+" tried to relight but is not in playersDB.");
	}
}

function sendImage(userID, channelID, filepath, won) {
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

// function canPlay(userID) {
// 	//Boolean. Is the player alloyed to play? (true if it's been more than 5 minutes)
//
// 	// logger.debug("Can "+userID+" play?");
// 	if (userID !== undefined){
// 		if (playersDB.players.hasOwnProperty(userID)){ //if player exists in DB
// 			if (playersDB.players[userID].lastPlayed !== undefined){
// 				var lastPlayed = playersDB.players[userID].lastPlayed;
// 				// logger.debug("lastPlayed: "+lastPlayed);
// 				var canPlay = Date.now() > lastPlayed + (5*60*1000); //5 minutes, in ms
// 				return canPlay;
// 			}else {
// 				logger.warn("lastPlayer is undefined for player "+userID);
// 				return true;
// 			}
// 		}else {
// 			logger.info("It seems that player "+userID+" has never played before.")
// 			return true;
// 		}
// 	}else{
// 		logger.error("Missing parameter function canPlay()");
// 		return false;
// 	}
// }

function askLevel(userID, username, channelID) {
	// Send a message to the user with their player level.
	if (pm.exists(userID)) {// userID exists in DB
		var p = pm.getPlayer(userID);
		if (p.relight) { // user have relit at least once
			bot.sendMessage({to: channelID, message: `<@${userID}> You are level \`${displayLevel(p)}\` and have relit \`${p.relight}\` time.`});
		} else {
			bot.sendMessage({
				to: channelID,
				message: `<@${userID}> You are level \`${p.level}\``
			});
		}
		logger.info(`${username} asked for their level: ${p.level}`);
	} else { // userID doesn't exist in DB
		bot.sendMessage({
			to: channelID,
			message: `<@${userID}> It seems you never played with me before, so you're level 1. You can type \`!light\` to play.`
		});
		logger.info(`${username} asked for their level but they never played before.`);
	}
}

function sendLog() {
	// logger.debug("I entered in sendLog().")
	var path = pathModule.join(appRoot.toString(), "logs", config.logErrorName)
	bot.uploadFile({
		to: config.backupChannel,
		file: path,
		message: "**The Node log:**"
	}, (err, res)=>{
		if (err){
			logger.warn("I had trouble sending the logs to the backup channel.")
			logger.warn(`Error returned: ${err}`)
		}
	})

	bot.uploadFile({
		to: config.backupChannel,
		file: playersDBPath,
		message: "**The PlayersDB**"
	}, (err, res) => {
		if (err){
			logger.warn("I had trouble sending the playersDB to the backup channel.")
			logger.warn(`Error returned: ${err}`)
		}
	})
}

function setupAutoBackups() {
	// This setups the daily auto backups. These backups are sent to the admin every 12 hours.
	logger.info(`Setting up the automated backup to every ${config.intervalLogBackup} hours.`)
	setInterval(()=>{
		logger.info(`It's time for the automated backup every ${config.intervalLogBackup} hours.`)
		sendLog()
	}, config.intervalLogBackup*60*60*1000) // hours to milliseconds
	// }, 10*1000) // 10 seconds, for debugging purpose
}
