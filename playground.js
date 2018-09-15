"use strict";

var logger = require('./logger.js');
var fs = require('fs');
const PlayerManager = require("./PlayerManager.js")

test();

function test(){
	logger.info("Hello! This is a test.");
	logger.info("Hi Atest! I'm Dad!");

	const pm = new PlayerManager("playersDB correct copy.json");
	// const player = pm.fetchOrCreatePlayer("123456789asdfasdf");
	console.log(pm);
	// logger.info(pm);
	// logger.info(`player: ${player}`);
}
