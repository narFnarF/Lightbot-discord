var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');

//Required to launch an app (exec)
//var sys = require('sys')
var exec = require('child_process').exec; // http://nodejs.org/api.html#_child_processes
var child;


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

//bot is online. Display in console.
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
    logger.info(''); //blank line return
});

//Disconnected for some reasons
bot.on("disconnected", function () {

	console.log("Disconnected for some reasons...");
	process.exit(1); //exit node with an error

});


//
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
                    message: 'Here\'s your image!'
                }), (err, res) => { console.log(err, res) };
            break;

            case 'app':
            	launchGame();
            break;
         }
     }
});


function launchGame() {
	logger.info("launching an app");
	// executes `pwd`
	child = exec("open '/Users/narF/Library/Application\ Support/itch/apps/light\ game/lightgame.app'",
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
