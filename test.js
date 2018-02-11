var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');

//launching app
//var sys = require('sys')
var exec = require('child_process').exec; // http://nodejs.org/api.html#_child_processes
var child;




function test() {
logger.info("launching an app");
// executes `pwd`
child = exec("open '/Users/narF/Library/Application\ Support/itch/apps/light\ game/lightgame.app'", function (error, stdout, stderr) {
	console.log('stdout: ' + stdout);
	console.log('stderr: ' + stderr);
	if (error !== null) {
		console.log('exec error: ' + error);
	}
});
}

test();