"use strict";

var logger = require('./logger.js');
var fs = require('fs');
const PlayerManager = require("./PlayerManager.js")
const config = require("./config.json")
// const Player = require("./Player.js")

play();
learning();
// runTests();

function play(){
	logger.info("Hello! This is a test.");
	logger.info("Hi Atest! I'm Dad!");

}

function learning() {
	asyncAwait();
}

async function asyncAwait(){
	var a = await doubleAfter2Seconds(3);
	console.log(a);
	var b = await doubleAfter2Seconds(4);
	console.log(b);
	var c = await doubleAfter2Seconds(a);
	console.log(c);
	var d = a + await doubleAfter2Seconds(b) + await doubleAfter2Seconds(c);
	console.log(d);
	console.log("result: ", a, b, c, d);
}

async function doubleAfter2Seconds(x) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(x * 2);
    }, 2000);
  });
}

function delay(duration) {
	return new Promise(function(resolve, reject) {
		setTimeout(()=>{
			// console.log("resolve()");
			// asdf = 3;
			resolve();
		}, duration);
	});
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
	try {
		var emptyFile = new PlayerManager("playersDB empty.json", "adminid1234") // the file exists, but it's empty → crash
	} catch (err) {
		// logger.debug(`But we caught that!`);
		test(emptyFile, undefined, 0.3);
	}
	new PlayerManager("playersDB doesn't exists.json", "adminid1234") // the file doesn't exists
	new PlayerManager("playersDB copy.json") // missing the adminID
	try {
		var emptyPM = new PlayerManager(); //missing the path parameter
	} catch (err) {
		// logger.info("All according to plan.")
		// console.log(emptyPM);
		logger.debug(`But we caught that!`);
		test(emptyPM, undefined, 0.5);
	}

	const pm = new PlayerManager("playersDB copy.json", config.ownerAdmin.discordID); // this one is good


	test(pm.exists(`doesn't exist ${Math.random()}`), false, 1);
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


	pm.writeDBFile((err)=>{
		if (err) {
			logger.warn(err);
		}
	});
	pm.writeDBFile((err)=>{ // This second write is there to test if the writes are queued properly.
		if (err) {
			logger.warn(err);
		}
	});

	logger.debug(`All tests completed. Est-ce que y'avait des warnings?`);
}
