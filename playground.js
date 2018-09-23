"use strict";

var logger = require('./logger.js');
var fs = require('fs');
const PlayerManager = require("./PlayerManager.js")
const config = require("./config.json")
// const Player = require("./Player.js")

play();
learning();
runTests();

function play(){
	logger.info("Hello! This is a test.");
	logger.info("Hi Atest! I'm Dad!");

}

function learning() {

}


function test(left, right, nb) {
	var verbose = false;
	var successful = (left === right);
	if (verbose) {
		logger.debug(`Test #${nb} ${successful}  ${left} == ${right}`);
	}

	if (!successful) {
		logger.warn(`Test #${nb} Result: ${left} != ${right}` );
	}
	return successful;
}

function runTests() {
	new PlayerManager("playersDB correct copy.json")
	try {
		var emptyPM = new PlayerManager();
	} catch (err) {
		// logger.info("All according to plan.")
		// console.log(emptyPM);
		test(emptyPM, undefined, 0.5);
	}
	const pm = new PlayerManager("playersDB correct copy.json", config.ownerAdmin.discordID);


	test(pm.exists("bullshit"), false, 1);
	pm.createPlayer("bullshit", "bullshit_name");
	test(pm.exists("bullshit"), true, 2);

	// console.log(pm);
	test(pm.getPlayer("bullshit").name, "bullshit_name", 3);
	test(pm.getPlayer("214590808727355393").name, "narF", 4);
	test(pm.getPlayer("existe pas"), undefined, 4.5);

	var p = pm.getOrCreatePlayer("new", "newName");
	test(p.name, "newName", 5);
	var p = pm.getOrCreatePlayer("bullshit");
	test(p.name, "bullshit_name", 6);

	p.increaseLevel();
	test(p.level, 2, 7);

	test(p.allowedToPlay(), true, 8);
	p.updateLastPlayed();
	test(p.allowedToPlay(), false, 9);

	test(p.relight, undefined, 10);
	p.increaseRelightCount();
	test(p.relight, 1, 11);

	test( pm.isAdmin("bullshit"), false, 12);
	test( pm.isAdmin("214590808727355393"), true, 13);

	pm.writeDBFile();
	pm.writeDBFile();
	pm.writeDBFile();
	pm.writeDBFile((err)=>{
		logger.info(`done writing the DB with err:${err}`)
	});

	logger.debug(`All tests completed. Est-ce que y'avait des warnings?`);
}
