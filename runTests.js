"use strict";

var logger = require('./logger.js');
const PlayerManager = require("./PlayerManager.js")


runTests();

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
	const pm = require('./PlayerManager.js');

	test(pm.exists(`doesn't exist ${Math.random()}`), false, 1);
	var first_bullshit = pm.createPlayer("bullshit", "bullshit_name");
	logger.debug(`Try to create another identical player. Should display a warning:`)
	var second_bullshit = pm.createPlayer("bullshit", "bullshit_name");
	test(pm.exists("bullshit"), true, 2);
	test(first_bullshit, second_bullshit, 2.5);

	test(pm.getPlayer("bullshit").name, "bullshit_name", 3);
	test(pm.getPlayer("existe pas"), undefined, 4.5);

	var p = pm.getOrCreatePlayer("new", "newName");
	test(p.name, "newName", 5);
	p = pm.getOrCreatePlayer("bullshit");
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
	logger.debug(`Try to double write. Should display a warning:`)
	pm.writeDBFile();

	logger.debug(`All tests completed. Est-ce que y'avait des warnings?`);
	// pm.exit()
}
