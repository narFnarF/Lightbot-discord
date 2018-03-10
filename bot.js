"use strict";

var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');

// Required to launch an app (exec)
// var sys = require('sys')
var exec = require('child_process').exec; // http://nodejs.org/api.html#_child_processes
var child;

// to write files
var fs = require('fs');

// Configure logger settings
initializeWinstonLogger();

logger.info("Launching the bot!")


// configurations
var dataJsonPath = "bin/data.json";
var playersDBPath = "playersDB.json";
var screenshotPath = "bin/screenshot.png";
var logPathConstruct = "bin/log construct.log";
var logPathNode = "lightbot.log";
var macCommand = "open 'bin/lightbot.app'";
var windowsCommand = "bin\\nw.exe";

var playersDB = readPlayerDBJson(); // Initialize the playersDB
var intentToExit = false; // If true, the app will exit on disconnections. Otherwise, it will try to reconnect.
var busy = false // Boolean. The bot cannot process !light command while this is true.

var adminNotifications = true;


function initializeWinstonLogger() {
	// Configure logger settings
	logger.remove(logger.transports.Console);
	logger.add(logger.transports.Console, {
		colorize: true,
		level: 'debug',
		timestamp: function () {
			return Date();
		}
	});

	logger.add(logger.transports.File, {
		name: 'info-log',
		filename: 'lightbot.log',
		level: 'debug',
		timestamp: function () {
			return Date();
		},
		maxsize: 500*1000, // 500KB
		maxFiles: 2,
		tailable: true, // The filename will always have the most recent log lines. The larger the appended number, the older the log file.
		json: false
	});

	logger.add(logger.transports.File, {
		name: 'warning-log',
		filename: 'lightbot-errors.log',
		level: 'warn',
		timestamp: function () {
			return Date();
		},
		maxsize: 500*1000, // 500KB
		maxFiles: 2,
		tailable: true, // The filename will always have the most recent log lines. The larger the appended number, the older the log file.
		json: false
	});
}


// Initialize Discord Bot
var bot = new Discord.Client({
	token: auth.token,
	autorun: true
});


// testing ground
var testingMode = false;
if (testingMode) {
	logger.warn('We\'re running in debug mode.');
	var id = '000000000fake00000';
	var username = 'fake';
	// id = 214590808727355393;
	// username = "narF"

	// logger.debug(canPlay(id));
	// preparePlayerData(id, username);
	// logger.debug(canPlay(id));
	// afterLaunching(id, "channelID", username);
	// logger.debug(canPlay(id));
	setTimeout(function(){
		logger.debug("presenceStatus: "+bot.presenceStatus);
		logger.debug("bot.connected: "+bot.connected);
	}, 5000);
}


// bot is online. Display in console.
bot.on('ready', function (evt) {
	logger.info('Connected');
	logger.info('I am '+bot.username+'  ('+bot.id+')' );
	// logger.debug(evt);
	console.log(); // blank line return

	bot.setPresence({game: {name: "type !light or !help"}});
	// logger.debug("presenceStatus: "+bot.presenceStatus);
	// logger.debug("bot.connected: "+bot.connected);
});


// // Reconnects if bot loses connection / connection is closed
bot.on('disconnect', (errMsg, errCode) => {
	// logger.debug("presenceStatus: "+bot.presenceStatus);
	// logger.debug("bot.connected: "+bot.connected);
	logger.warn("Disconnected. Code: "+errCode);
	if (errMsg) {
		logger.info(errMsg);
	}
	if (intentToExit) {
		// intentional disconnection
		logger.info("Intentional disconnect");
		logger.info("Bye bye!");
		process.exit(); // Exit Node
		// setTimeout(reconnect, 2000); // temporaire, le temps qu'on comprenne pourquoi ça déconnecte avec err1000 des fois
	}else{
		// unintentional disconnect
		logger.warn("Disconnected unintentionally!");
		setTimeout(reconnect, 2000);
	}
});

function reconnect() {
	logger.info("Attempting to reconnect.");
	bot.connect();
}

// When a message is received
bot.on('message', function (username, userID, channelID, message, evt) {
	// Our bot needs to know if it will execute a command
	// It will listen for messages that will start with `!`
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
				if (userID == playersDB.admin.narF) {
					var name = args.join(" ");
					logger.info("Renaming the bot to: "+name);
					bot.editUserInfo({"username": name}, function(error, response){
						if (error) {
							logger.warn(error);
							bot.sendMessage({
								to: channelID,
								message: "<@"+userID+"> Rename unsuccessful for some reasons..."
							});
						}else{
							//TODO send success
							bot.sendMessage({
								to: channelID,
								message: "<@"+userID+"> Rename successful to "+name
							});
							logger.info("Success.")
						}
					});
				}else {
					logger.info(username+" tried to change the bot name, but I stopped them.");
					bot.sendMessage({
						to: channelID,
						message: "<@"+userID+"> You're not my admin. You cannot change my name."
					})
				}
			break;

			case 'help':
				bot.sendMessage({
					to: channelID,
					message: "Hello <@"+userID+">. I'm **Light Bot**. Request a picture by typing `!light` in the chat. Your progression is saved and your image evolves over time. You can type `!helpmore` for additional details."
				});
				logger.info("Help requested by "+username);
			break;

			case 'helpmore':
				bot.sendMessage({
					to: channelID,
					message: "<@"+userID+"> Light bot will enlight your day by generating pretty images that are unique to you. Every time you call it with the `!light` command, your image will evolve. You can call it every 5 minutes, which is how long it takes to generate a new image for you. \n**Commands:**\n`!light` Request your image.\n`!level` Tell you your current level.\n`!link` To get the URL link to the original version of this game. \n`!invite` To get an URL to invite Light Bot to your own Discord server. \n`!helpadmin` Help about admin commands.\nYou can also play the app version of this light game at https://narf.itch.io/light-game "
				});
				logger.info("More help requested by "+username);
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
				if (canPlay(userID)) {
					if (!busy) {
						try {
							busy = true
							logger.info("Player "+username+" wants light.")
							preparePlayerData(userID, username);
							bot.sendMessage({
								to: channelID,
								message: "<@"+userID+"> Enlightment is coming (in about 5 seconds)"
							}, function(err, res) {
								if (err){
									logger.warn(err)
									return
								}
								deleteMsgAfterDelay(res.id, channelID, 5)
							});
							launchGame();
							setTimeout(afterLaunching, 5000, userID, channelID); //wait 5 sec
						} catch (e) {
							busy = false
							bot.sendMessage({
								to: channelID,
								message: "<@"+userID+"> Sorry. There was an error on my side. Maybe try again in a bit?"})
							logger.error(e);
							bot.sendMessage({
								to: channelID,
								message: e
							})
						}
					} else {
						logger.info("Player "+username+" "+userID+" tried to play but I'm busy!")
						bot.sendMessage({
							to: channelID,
							message: "<@"+userID+"> Sorry, I can only handle one light show at a time."})
					}

				} else {
					logger.info("Player "+username+" "+userID+" is not allowed to play at the moment.")
					bot.sendMessage({
						to: channelID,
						message: "<@"+userID+"> Life is too short to be in a state of rush. Your image evolves only every **5 minutes**. Close your eyes, take a deep breath, then try again."})
				}
			break;

			case 'log':
				if (userID == playersDB.admin.narF){
					logger.info("Log requested by "+username)

					var log = fs.readFileSync(logPathConstruct)
					bot.sendMessage({
						to: playersDB.admin.narF,
						message: "**Construct Log:** ```"+log+"```\n"
					})

					bot.uploadFile({
						to: playersDB.admin.narF,
						file: logPathNode,
						message: "**The Node log:**"
					}), function (err, res) {
						if (err){logger.warn(err)}
						if (res){logger.info(res)}
					}

					bot.uploadFile({
						to: playersDB.admin.narF,
						file: playersDBPath,
						message: "**The PlayersDB**"
					}), function (err, res) {
						if (err){logger.warn(err)}
						if (res){logger.info(res)}
					}
				}else {
					bot.sendMessage({
						to: channelID,
						message: "<@"+userID+"> You are not my admin. You cannot request logs."
					})
				}
			break;

			case 'level':
				askLevel(userID, username, channelID);
			break;

			case 'invite':
				bot.sendMessage({
					to: userID,
					message: "<@"+userID+"> Here's the link to invite Light Bot to your own server. The bot keeps your progression saved between Discord servers. If you're not the server's admin, you can't invite the bot. In that case, you should give the link to the server owner so that they can invite it. \n"+bot.inviteURL
				})
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
	setTimeout(function () {
		logger.warn("Timout on disconnection. Let's quit anyway!");
		process.exit(); // Quit the server
	}, 5000);

	// En attendant de trouver pourquoi il déconnecte pas correctement, on force quit après 1 seconde
	// setTimeout(function () {
	// 	logger.debug("Tant! pis!");
	// 	process.exit(); // Quit the server
	// }, 1000);
});

function launchGame() {
	// logger.debug("Launching the Construct app");
	var windows = "win32";
	var mac = "darwin";
	var runThis;
	if (process.platform == windows) {
		runThis = windowsCommand
	}else if (process.platform == mac) {
		runThis = macCommand
	}else {
		logger.error("Seriously, which platform am I running on???");
		return;
	}

	child = exec(runThis,
		function (error, stdout, stderr) {
			if (stdout !== null && stdout !== ""){
				logger.info('stdout: ' + stdout);
			}
			if (stderr !== null && stderr !== ""){
				console.warn('stderr: ' + stderr);
			}
			if (error !== null) {
				console.warn('exec error: ' + error);
			}
		}
	);
}

function readPlayerDBJson(){
	//returns an object: the entire playersDB!
	logger.info("Let's read the DB file!");
	var json;
	if (fs.existsSync(playersDBPath)) { //if the file exists on disk
		//logger.info("The file playersDB.json exists!");

		//read playersDB.json
		var data;
		try {
			data = fs.readFileSync(playersDBPath, "utf8");
		} catch (e) {
			logger.warn("The playersDB exists but cannot be read.");
			logger.warn(e);
			throw "playersDB exists but cannot be read";
		}

		//parse JSON
		json = JSON.parse(data);

		//check if DB is empty
		if (!json.hasOwnProperty("players")) {
			json.players = {};
			logger.warn("The DB was missing it's player node, but we recreated it.");
		}
	}else{
		logger.warn("File 'playersDB.json' doesn't exists, but we're going to create it!");
		json = {players:{}};
	}
	return json;
}

function preparePlayerData(userID, username){
	registerPlayerInDB(userID, username);
	saveDataJson(userID, username);
}

function registerPlayerInDB(userID, username) {
	// logger.debug("We're registering player "+username+" "+userID);
	if (playersDB.players.hasOwnProperty(userID)){ //if player already exist
		// logger.debug("Found player "+username+" "+userID);

		//check if it's missing any values:
		if (!playersDB.players[userID].hasOwnProperty("level")) { //missing level
			playersDB.players[userID].level = 1; //set level to 1
			logger.warn(userID+" was missing it's level so it was set to 1.");
		}
		if (!playersDB.players[userID].hasOwnProperty("win")) { //missing win
			playersDB.players[userID].win = false; //set level to 1
			logger.warn(userID+" was missing it's win state so it was set to false.");
		}
		if (!playersDB.players[userID].hasOwnProperty("lastPlayed")) { //missing lastPlayed timestamp
			playersDB.players[userID].lastPlayed = 0; //set level to 1
			logger.warn(userID+" was missing it's lastPlayed timestamp so it was set to 0.");
		}
	}else{
		logger.info(username+" "+userID+" was not in the playersDB. But we're going to add it!")
		playersDB.players[userID] = {
			"username": username,
			"level": 1,
			"win": false,
			"lastPlayed": 0
		};
	}
	// logger.debug("Finished registering player "+username+" "+userID+" data "+JSON.stringify(playersDB.players[userID]));
	savePlayersDB();
}


function saveDataJson(userID) {
	//Write data.json to disk

	//get the data from the DB
	var playerData = JSON.parse(JSON.stringify(playersDB.players[userID])); //make a copy
	playerData.userID = userID;

	//make it pretty and write in file on disk
	var beautifulPlayerData = JSON.stringify(playerData, null, 4);
	fs.writeFileSync(dataJsonPath, beautifulPlayerData);
	// logger.debug("Saved data.json to disk.");
}

function savePlayersDB() {
	//write playersDB.json
	var beautifulPlayersDB = JSON.stringify(playersDB, null, 4);
	try{
		fs.writeFileSync(playersDBPath, beautifulPlayersDB);
		// logger.debug("Saved the DB");
	}catch(e){
		logger.warn("Could not write playersDB.json on disk.");
		logger.warn(e);
	}
}

function afterLaunching(userID, channelID) {
	// logger.info("afterLaunching()")
	sendImage(userID, channelID);
	mergeDataToDB(userID);
	announceResult(userID, channelID);
}

function announceResult(userID, channelID){
	var msg
	var level = playersDB.players[userID].level
	var win = playersDB.players[userID].win
	var username = playersDB.players[userID].username
	msg = "You are level "+level+"."
	if (win) {
		doLevelUp(userID)
		level = playersDB.players[userID].level; //necessary to get the updated level
		msg += "\n🎇 Enlighted! You've reached level "+level+". 🎇 I wonder what will your next image look like?"
	}
	bot.sendMessage({
		to: channelID,
		message: "<@"+userID+"> "+msg
	})
	if (level >= 4 && !win) {
		bot.sendMessage({
			to: channelID,
			message: "<@"+userID+"> You're getting good at this. Can you tell us what you see in this picture?"
		})
	}

	logger.info("Sent lightshow to "+username+" (level "+level+" won:"+win+").")
	busy = false
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
		// logger.debug("deleted now!")
	}, delayInSeconds*1000)
}

function doLevelUp(userID) {
	// Do the level up data modifications inside playersDB
	playersDB.players[userID].level++;
	playersDB.players[userID].win = false;
	savePlayersDB(); // write playersDB to file playersDB.json
}

function mergeDataToDB(userID) {
	// read data.json
	var data = fs.readFileSync(dataJsonPath)
	var playerData = JSON.parse(data);
	delete playerData.userID; //remove "userID": 123455666 node beforme merging in DB
	playerData.lastPlayed = Date.now(); //set lastPlayed timestamp

	// merge data.json in playersDB
	playersDB.players[userID] = playerData;

	// logger.debug("Merged data.json into playersDB.json.")
	savePlayersDB(); // write playersDB to file playersDB.json
}

function sendImage(userID, channelID) {
	// logger.info("sendImage")
	if (fs.existsSync(screenshotPath)) { //if the file exists on disk
		bot.uploadFile({
			to: channelID,
			file: screenshotPath,
			message: "<@"+userID+"> Here's your lightshow!"
		}), function (err, res) {
			if (err){logger.warn(err)}
			if (res){logger.info(res)}
		};
	}else{
		logger.error("The screenshot isn't there?!");
		bot.sendMessage({
			to: channelID,
			message: "<@"+userID+"> Err... sorry, i messed up. Maybe try again in a couple minutes?"
		});
		// throw "Screenshot is missing";
	}
}


function canPlay(userID) {
	//Boolean. Is the player alloyed to play? (true if it's been more than 5 minutes)

	// logger.debug("Can "+userID+" play?");
	if (userID !== undefined){
		if (playersDB.players.hasOwnProperty(userID)){ //if player exists in DB
			if (playersDB.players[userID].lastPlayed !== undefined){
				var lastPlayed = playersDB.players[userID].lastPlayed;
				// logger.debug("lastPlayed: "+lastPlayed);
				return Date.now() > lastPlayed + (5*60*1000); //5 minutes, in ms
			}else {
				logger.warn("lastPlayer is undefined for player "+userID);
				return true;
			}
		}else {
			logger.info("It seems that player "+userID+" has never played before.")
			return true;
		}
	}else{
		logger.error("Missing parameter function canPlay()");
		return false;
	}
}

function askLevel(userID, username, channelID) {
	if (playersDB.players[userID]) {// userID exists in DB
		bot.sendMessage({
			to: channelID,
			message: '<@'+userID+'> You are level `'+playersDB.players[userID].level+'`'
		});
		logger.info(username+' asked for their level: '+playersDB.players[userID].level);
	} else { // userID doesn't exist in DB
		bot.sendMessage({
			to: channelID,
			message: '<@'+userID+'> It seems you never played with me before. You can type `!light` to play.'
		});
		logger.info(username+' asked for their level but they never played before.');
	}
}
