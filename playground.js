"use strict";

var logger = require('./logger.js');
var fs = require('fs');
const PlayerManager = require("./PlayerManager.js")
// const Player = require("./Player.js")

play();
learning();
runTests(true);

function play(){
	logger.info("Hello! This is a test.");
	logger.info("Hi Atest! I'm Dad!");

}

function learning() {

}


function test(left, right, nb) {
	var verbose = false;
	var result = (left == right);
	if (verbose) {
		logger.debug(`Test #${nb} ${result}  ${left} == ${right}`);
	}

	if (!result) {
		logger.warn(`Test #${nb} Result: ${left} != ${right}` );
	}
}

function runTests() {
	const pm = new PlayerManager("playersDB correct copy.json");

	test(pm.exists("bullshit"), false, 1);
	pm.createPlayer("bullshit", "bullshit_name")
	test(pm.exists("bullshit"), true, 2);

	// console.log(pm);
	test(pm.getPlayer("bullshit").name, "bullshit_name", 3)
	test(pm.getPlayer("214590808727355393").name, "narF", 4)

	var p = pm.getOrCreatePlayer("new", "newName");
	test(p.name, "newName", 5)
	var p = pm.getOrCreatePlayer("bullshit");
	test(p.name, "bullshit_name", 6)

	p.increaseLevel()
	test(p.level, 2, 7)

	test(p.allowedToPlay(), true, 8)
	p.updateLastPlayed();
	test(p.allowedToPlay(), false, 9)

	test(p.relight, undefined, 10)
	p.increaseRelightCount()
	test(p.relight, 1, 11)

	// pm.writeDBFile((err)=>{
	// 	logger.info(`done writing the DB with err:${err}`)
	// })

	logger.debug(`All tests completed. Is there any warnings?`)
}
