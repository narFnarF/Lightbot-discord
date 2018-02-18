var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');

//Required to launch an app (exec)
//var sys = require('sys')
var exec = require('child_process').exec; // http://nodejs.org/api.html#_child_processes
var child;

//to write files
var fs = require('fs');

var dataJsonPath = "bin/data.json";
var playersDBPath = "playersDB.json";
var screenshotPath = "bin/screenshot.png";
var playersDB = readPlayerDBJson(); //Initialize the playersDB


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


//testing ground
if (testingMode = false){
	logger.warn ("We're running in debug mode.")
	var id = "000000000fake00000";
	var username = "fake";
	// id = 214590808727355393;
	// username = "narF"

	// logger.debug(canPlay(id));
	preparePlayerData(id, username);
	// logger.debug(canPlay(id));
	// afterLaunching(id, "channelID", username);
	// logger.debug(canPlay(id));
}


//bot is online. Display in console.
bot.on('ready', function (evt) {
	logger.info('Connected');
	logger.info('Logged in as: '+bot.username+' - ('+bot.id+')' );
	console.log(); //blank line return

	bot.setPresence({game:{ name: "type !help for infos"}});
});

//Disconnected for some reasons
bot.on("disconnected", function () {
	console.log("Disconnected for some reasons...");
	process.exit(1); //exit node with an error
	//TODO reconnect instead?
});


// When a message is received
bot.on('message', function (username, userID, channelID, message, evt) {
	// Our bot needs to know if it will execute a command
	// It will listen for messages that will start with `!`
	if (message.substring(0, 1) == '!') {
		var args = message.substring(1).split(' ');
		var cmd = args[0];

		args = args.splice(1);
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

			// case 'img':
			// 	logger.info('posting an image');
			// 	bot.sendMessage({to: channelID, message: "Incoming image..."});
			// 	bot.uploadFile({
			// 		to: channelID,
			// 		file: "/Users/narF/Downloads/SpaceteamAdmiralsClub_DigitalPackage_Part2/patch/Patch_small.png",
			// 		message: "Here's your image!"
			// 	}), (err, res) => { console.log(err, res) };
			// break;

			case "help":
				bot.sendMessage({
					to: channelID,
					message: "Hello. I'm a bot. Request a picture by typing \"!light\" in the chat. Your progression is saved and your image evolves over time."
				});
				logger.info("Help requested.")
			break;

			case "register":
				registerPlayerInDB(userID,username);
				logger.info("Registered user"+userID+" "+username);
				bot.sendMessage({
					to: channelID,
					message: "You're registered!\n"+JSON.stringify(playersDB.players[userID], null, 4)
				});
			break;

			case 'light':

				if (canPlay(userID)) {
					try {
						preparePlayerData(userID, username);
						bot.sendMessage({
							to: channelID,
							message: "<@"+userID+"> Your image is comming (in about 5 seconds)"})
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
		}
	}
});


// Control+C signal received: disconnect the bot before exit
process.on("SIGINT", function () {
	console.log("");
	logger.info("Disconnecting bot...")
	bot.sendMessage({
		to: playersDB.admin["narF"],
		message: "Bot is shutting down. Bye bye!"
	})

	setTimeout(function(){
		logger.info("Bye bye!  "+playersDB.admin["narF"])
		bot.disconnect();
		process.exit();
	}, 1000);
});

function launchGame() {
	logger.info("Launching the Construct app");
	// executes `pwd`
	child = exec("open '/Users/narF/Documents/game\ dev/git\ stuff/bot-discord/bin/lightbot.app'",
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
	mergeDataToDB(userID);
	sendImage(userID, channelID);
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
	try{
		bot.uploadFile({
			to: channelID,
			file: "/Users/narF/Downloads/SpaceteamAdmiralsClub_DigitalPackage_Part2/patch/Patch_small.png",
			message: "<@"+userID+"> Here's your image!"
		}), (err, res) => { console.log(err, res) };
	}catch(e){
		logger.error("Could not send the image.")
		logger.error(e);
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
