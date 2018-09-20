"use strict";

var logger = require('./logger.js');
var fs = require('fs');
const PlayerManager = require("./PlayerManager.js")
// const Player = require("./Player.js")

play();
learning();

function play(){
	logger.info("Hello! This is a test.");
	logger.info("Hi Atest! I'm Dad!");

	const pm = new PlayerManager("playersDB correct copy.json");
	// const player = pm.fetchOrCreatePlayer("123456789asdfasdf");
	// console.log(pm);

	logger.debug(`Does player bullshit exists? Should be false: ${pm.exists("bullshit")}`);
	pm.createPlayer("bullshit", "bullshit_name")
	logger.debug(`Does player bullshit exists? Should be true: ${pm.exists("bullshit")}`);
	// console.log(pm);
	logger.info(`name should be bullshit_name: ${pm.getPlayer("bullshit").name}`)
	logger.info(`name should be narF: ${pm.getPlayer("214590808727355393").name}`)

	// console.log (pm.getPlayer("bullshit"))
	// console.log (pm.getPlayer("214590808727355393"))


	// console.log(pm.getPlayer("bullshit").getName());
	// console.log(pm.getPlayer("214590808727355393").getName());
	// pm.writeDBFile((err)=>{
	// 	logger.info(`done writing the DB with err:${err}`)
	// })
}

function learning() {

}
