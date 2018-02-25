var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');

// Required to launch an app (exec)
// var sys = require('sys')
var exec = require('child_process').exec; // http://nodejs.org/api.html#_child_processes
var child;

// to write files
var fs = require('fs');

// configurations
var dataJsonPath = "bin/data.json";
var playersDBPath = "playersDB.json";
var screenshotPath = "bin/screenshot.png";
var logPath = "bin/log.txt";
var macCommand = "open '/Users/narF/Documents/game\ dev/git\ stuff/bot-discord/bin/lightbot.app'";
var windowsCommand = "bin\\nw.exe";

var playersDB = readPlayerDBJson(); // Initialize the playersDB


// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
	colorize: true
});
logger.level = 'debug';


// Initialize Discord Bot
var bot = new Discord.Client({
	token: auth.token,
	autorun: true
});


// testing ground
if (testingMode = false) {
	logger.warn('We\'re running in debug mode.');
	var id = '000000000fake00000';
	var username = 'fake';
	// id = 214590808727355393;
	// username = "narF"

	// logger.debug(canPlay(id));
	preparePlayerData(id, username);
	// logger.debug(canPlay(id));
	// afterLaunching(id, "channelID", username);
	// logger.debug(canPlay(id));
}


// bot is online. Display in console.
bot.on('ready', function (evt) {
	logger.info('Connected');
	logger.info('I am '+bot.username+'  ('+bot.id+')' );
	console.log(); // blank line return

	bot.setPresence({game: {name: "type !light or !help"}});
});


// // Reconnects if bot loses connection / connection is closed
bot.on('disconnect', (errMsg, errCode) => {
    logger.warn("Disconnected. Code: "+errCode);
	if (errMsg) {
		logger.info(errMsg);
	}
	if (errCode===1000) {
		// intentional disconnection
		logger.info("Intentional disconnect");
		logger.info("Bye bye!");
		process.exit(); // Exit Node
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
			// !ping
			case 'ping':
				bot.sendMessage({
					to: channelID,
					message: 'Pong!'
				});
				logger.info('Ping pong!');
			break;

			case 'prout':
				bot.sendMessage({
					to: channelID,
					message: 'Attention tout le monde! <@'+userID+'> a pété! Ça va sentir! 💩 '
				});
				logger.info(username+' ('+userID+') a pété! 💩 ');
			break;


			case "rename":
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
					});
				}
			break;

			case "help":
				bot.sendMessage({
					to: channelID,
					message: "Hello. I'm a bot. Request a picture by typing `!light` in the chat. Your progression is saved and your image evolves over time."
				});
				logger.info("Help requested.");
			break;

			break;

			case 'light':
				if (canPlay(userID)) {
					try {
						preparePlayerData(userID, username);
						bot.sendMessage({
							to: channelID,
							message: "<@"+userID+"> Enlightment is coming (in about 5 seconds)"});
						launchGame();
						setTimeout(afterLaunching, 5000, userID, channelID); //wait 5 sec
					} catch (e) {
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
					logger.info("Player "+username+" "+userID+" is not allowed to play at the moment.")
					bot.sendMessage({
						to: channelID,
						message: "<@"+userID+"> Aren't you a little impatient? Your image evolves only every 5 minutes. Use that time to meditate, then try again."})
				}
			break;

			case "log":
				if (userID == playersDB.admin.narF){
					var log = fs.readFileSync(logPath);
					bot.sendMessage({
						to: playersDB.admin.narF,
						message: "```"+log+"```"
					});
					logger.info("Log requested.");
				}
			break;

			case 'level':
				askLevel(userID, username, channelID);
			break;
		}
	}
});


// Control+C signal received: disconnect the bot before exit
process.on("SIGINT", function () {
	console.log("");
	logger.info("SIGINT received. Disconnecting bot...");
	bot.disconnect();
});

function launchGame() {
	logger.info("Launching the Construct app");
	// TODO make this line multiplatform for my own sake. Also configurable.
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
				console.log('stdout: ' + stdout);
			}
			if (stderr !== null && stderr !== ""){
				console.log('stderr: ' + stderr);
			}
			if (error !== null) {
				console.log('exec error: ' + error);
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
		// try {
		// 	json = JSON.parse(data);
		// } catch (e) {
		// 	logger.warn(e);
		// 	throw "playersDB.json is not a proper JSON."
		// 	//json = {players:{}};
		// }

		//check if DB is empty
		if (!json.hasOwnProperty("players")) {
			json.players = {};
			logger.warn("The DB was missing it's player node, but we recreated it.");
		}
	}else{
		logger.warn("File 'playersDB.json' doesn't exists, but we're going to create it!");
		json = {players:{}};
	}
	// console.log(json);
	return json;
}

function preparePlayerData(userID, username){
	registerPlayerInDB(userID, username);
	saveDataJson(userID, username);
}

function registerPlayerInDB(userID, username) {
	logger.info("We're registering player "+username+" "+userID);
	if (playersDB.players.hasOwnProperty(userID)){ //if player already exist
		logger.info("Found player "+username+" "+userID);

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
		logger.warn(username+" "+userID+" was not in there. But we're going to add it!")
		playersDB.players[userID] = {
			"username": username,
			"level": 1,
			"win": false,
			"lastPlayed": 0
		};
		// console.log(playersDB);
	}
	logger.info("Finished registering player "+username+" "+userID+" data "+JSON.stringify(playersDB.players[userID]));
	savePlayersDB();
}


function saveDataJson(userID) {
	//Write data.json to disk

	//get the data from the DB
	playerData = JSON.parse(JSON.stringify(playersDB.players[userID])); //make a copy
	playerData.userID = userID;

	//make it pretty and write in file on disk
	var beautifulPlayerData = JSON.stringify(playerData, null, 4);
	fs.writeFileSync(dataJsonPath, beautifulPlayerData);
	logger.info("Saved data.json to disk.");
}

function savePlayersDB() {
	//write playersDB.json
	var beautifulPlayersDB = JSON.stringify(playersDB, null, 4);
	try{
		fs.writeFileSync(playersDBPath, beautifulPlayersDB);
		logger.info("Saved the DB");
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
	var msg;
	var level = playersDB.players[userID].level;
	var win = playersDB.players[userID].win;
	if (win) {
		doLevelUp(userID);
		level = playersDB.players[userID].level; //necessary to get the updated level
		msg = "Enlighted! You've reached level "+level+". I wonder what will your next image look like?";
	}else {
		msg = "You are level "+level+". Delightful!";
	}
	bot.sendMessage({
		to: channelID,
		message: "<@"+userID+"> "+msg
	});
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

	logger.info("Merged data.json into playersDB.json.")
	savePlayersDB(); // write playersDB to file playersDB.json
}

function sendImage(userID, channelID) {
	// logger.info("sendImage")
	if (fs.existsSync(screenshotPath)) { //if the file exists on disk
		bot.uploadFile({
			to: channelID,
			file: screenshotPath,
			message: "<@"+userID+"> Here's your image!"
		}), function (err, res) { console.log(err, res) };
	}else{
		logger.error("The screenshot isn't there?!");
		bot.sendMessage({
			to: userID,
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
				lastPlayed = playersDB.players[userID].lastPlayed;
				logger.info("lastPlayed: "+lastPlayed);
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
		logger.info(username+'asked for their level: '+playersDB.players[userID].level);
	} else { // userID doesn't exist in DB
		bot.sendMessage({
			to: channelID,
			message: '<@'+userID+'> It seems you never played with me before. You can type `!light` to play.'
		})
	}
}
