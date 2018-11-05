"use strict";

const logger = require('./logger.js');
const Player = require('./Player.js');

play();

function play(){
	logger.info("Hello! This is a test.");
	logger.info("Hi Atest! I'm Dad!");

	Player.endLevel = 20;
	const toto = new Player("12345", "toto");
	toto.level = 5;
	toto.increaseRelightCount();
	logger.info(`toto.displayLevel = ${toto.displayLevel}`)

}
