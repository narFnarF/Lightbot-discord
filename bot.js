var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');

//Required to launch an app (exec)
//var sys = require('sys')
var exec = require('child_process').exec; // http://nodejs.org/api.html#_child_processes
var child;

//to write files
var fs = require('fs');



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
	test("fake123");
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
				test(userID);
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


function test(userID) {
	if (fs.existsSync("playersDB.json")) {
		//logger.info("playersDB.json exists!");

		//read playersDB.json
		var data;
		try {
			data = fs.readFileSync("playersDB.json", "utf8");
		} catch (e) {
			logger.warn("Could not read playersDB.json for some reasons.");
			logger.warn(e);
		}

		//parse JSON
		try {
			playersDB = JSON.parse(data);
		} catch (e) {
			logger.warn("playersDB.json had error and will be recreated.");
			logger.warn(e);
			playersDB = {players:{}};
		}
	}else{
		logger.warn("File 'playersDB.json' doesn't exists, but we're going to create it!");
		playersDB = {players:{}};
	}
	preparePlayerData(userID, playersDB);
};



function preparePlayerData(userID, playersDB){
	//logger.info("We're looking for player "+userID);
	//console.log(playersDB);
	if (userID in playersDB.players){
		logger.info("Found player "+userID);
		playerData = playersDB.players[userID];
	}else{
		logger.warn(userID+" was not in there. But we're going to add it!")
		playerData = {
			"level": 1,
			"win": false
		};
		playersDB.players[userID] = playerData;
		//console.log(playersDB);
	}
	logger.info("Player "+userID+" data "+JSON.stringify(playerData));
	var beautifulPlayerData = JSON.stringify(playerData, null, 4);
	var beautifulPlayersDB = JSON.stringify(playersDB, null, 4);

	//write data.json
	try{
		fs.writeFileSync("data.json", beautifulPlayerData);
	}catch(e){
		logger.warn("Could not write data.json on disk.");
		logger.warn(e);
	}

	//write playersDB.json
	try{
		fs.writeFileSync("playersDB.json", beautifulPlayersDB);
	}catch(e){
		logger.warn("Could not write playersDB.json on disk.");
		logger.warn(e);
	}
}

function recollectPlayerData() {

}
