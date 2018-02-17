var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');

//Required to launch an app (exec)
//var sys = require('sys')
var exec = require('child_process').exec; // http://nodejs.org/api.html#_child_processes
var child;

//to write files
var fs = require('fs');


var playersDB = readPlayerDBJson(); //Initialize the playersDB


// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
	colorize: true
});
logger.level = 'debug';


// Initialize Discord Bot
var testingMode = true;
if (!testingMode){
	var bot = new Discord.Client({
		token: auth.token,
		autorun: true
	});
}else {
	logger.warn ("We're running in debug mode.")
	var id = "fake4";

	//registerPlayerInDB(id);
	preparePlayerData(id);
	//savePlayersDB();
}

/*
//bot is online. Display in console.
bot.on('ready', function (evt) {
	logger.info('Connected');
	logger.info('Logged in as: '+bot.username+' - ('+bot.id+')' );
	logger.info(''); //blank line return
});

//Disconnected for some reasons
bot.on("disconnected", function () {
	console.log("Disconnected for some reasons...");
	process.exit(1); //exit node with an error
	//TODO reconnect instead?
});


// When a message is received
bot.on('message', function (user, userID, channelID, message, evt) {
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
				logger.info(user+' ('+userID+') a pété! 💩 ');
			break;

			case 'img':
				logger.info('posting an image');
				bot.sendMessage({to: channelID, message: "Incoming image..."});
				bot.uploadFile({
					to: channelID,
					file: "/Users/narF/Downloads/SpaceteamAdmiralsClub_DigitalPackage_Part2/patch/Patch_small.png",
					message: "Here's your image!"
				}), (err, res) => { console.log(err, res) };
			break;

			case 'app':
				registerPlayerInDB(userID);
				preparePlayerData(userID);
				launchGame();
				//TODO wait some seconds, or wait for a callback?
				//TODO read data.json and put that back inside playersDB.json
			break;
		}
	}
});
*/

function launchGame() {
	logger.info("launching an app");
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
	var json = {};
	if (fs.existsSync("playersDB.json")) { //if the file exists on disk
		//logger.info("The file playersDB.json exists!");

		//read playersDB.json
		var data;
		try {
			data = fs.readFileSync("playersDB.json", "utf8");
		} catch (e) {
			logger.warn("The playersDB exists but cannot be read.");
			logger.warn(e);
			throw "playersDB exists but cannot be read";
		}

		//parse JSON
		try {
			json = JSON.parse(data);
		} catch (e) {
			logger.warn("playersDB.json had error and will be recreated.");
			logger.warn(e);
			throw "playersDB.json is not a proper JSON."
			//json = {players:{}};
		}
	}else{
		logger.warn("File 'playersDB.json' doesn't exists, but we're going to create it!");
		json = {players:{}};
	}
	return json;
}

function registerPlayerInDB(userID) {
	logger.info("We're registering player "+userID);
	if (playersDB.players.hasOwnProperty(userID)){ //if player already exist
		logger.info("Found player "+userID);

		//check if it's missing any values:
		if (!playersDB.players[userID].hasOwnProperty("level")) { //missing level
			playersDB.players[userID].level = 1; //set level to 1
			logger.warn(userID+" was missing it's level.")
		}
		if (!playersDB.players[userID].hasOwnProperty("win")) { //missing win
			playersDB.players[userID].win = false; //set level to 1
			logger.warn(userID+" was missing it's win state.")
		}
		if (!playersDB.players[userID].hasOwnProperty("lastPlayed")) { //missing lastPlayed timestamp
			playersDB.players[userID].lastPlayed = 0; //set level to 1
			logger.warn(userID+" was missing it's lastPlayed timestamp.")
		}
	}else{
		logger.warn(userID+" was not in there. But we're going to add it!")
		playersDB.players[userID] = {
			"level": 1,
			"win": false,
			"lastPlayed": 0
		};
		//console.log(playersDB);
	}
	logger.info("Finished registering player "+userID+" data "+JSON.stringify(playersDB.players[userID]));
	savePlayersDB();
}


function preparePlayerData(userID){
	//logger.info("We're looking for player "+userID);
	//console.log(playersDB);
	registerPlayerInDB(userID);
	saveDataJson(userID); //TODO qu'est-ce qu'on fait si ça n'a pas écrit?
	savePlayersDB();
}


function saveDataJson(userID) {
	//Write data.json to disk

	//get the data from the DB
	playerData = JSON.parse(JSON.stringify(playersDB.players[userID])); //make a copy
	playerData.userID = userID;

	//make it pretty and write in file on disk
	var beautifulPlayerData = JSON.stringify(playerData, null, 4);
	fs.writeFileSync("data.json", beautifulPlayerData);
}

function savePlayersDB() {
	//write playersDB.json
	var beautifulPlayersDB = JSON.stringify(playersDB, null, 4);
	try{
		fs.writeFileSync("playersDB.json", beautifulPlayersDB);
		logger.info("Saved the DB");
	}catch(e){
		logger.warn("Could not write playersDB.json on disk.");
		logger.warn(e);
	}
}

function afterLaunching(userID) {
	// read data.json
	var data = fs.readFileSync("data.json")
	playerData = JSON.parse(data);

	// get player's level
	//var level = playerData.level;
	//var win = playerData.win;
	// logger.info("avant!")
	// console.log(playerData);
	// console.log(playersDB);
	// console.log(userID);

	// merge data.json in playersDB
	if (!playersDB.players.hasOwnProperty(userID)) { //if the player is missing for some reason
		playersDB.players[userID] = {}; //create an empty player
	}
	playersDB.players[userID].level = playerData.level;
	playersDB.players[userID].win = playerData.win;

	// write playersDB to file playersDB.json
	var beautifulPlayersDB = JSON.stringify(playersDB, null, 4);
	fs.writeFileSync("playersDB.JSON", beautifulPlayersDB);
}

function canPlay(userID) {
	//Boolean. Returns if the player userID is allowed to play (true if it's been more than 5 minutes)
	var lastTime = playersDB.players[userID].lastPlayed;
	if(lastTime===undefined){
		logger.warn("It seems that player "+userID+" has never played before.")
		//return true;
		lastTime = 0;
		playersDB.players[userID].lastPlayed = 0;
	}
	logger.info("lastTime: "+lastTime);
	return Date.now() > lastTime + (5*60*1000); //5 minutes, in ms
}
