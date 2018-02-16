var logger = require('winston');

//writing files
var fs = require('fs');

test("fake123");
test("fake4");
test("fake winner");
test("fake winner");
test("fake4");

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
