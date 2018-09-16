"use strict";

// Dependencies
const fs = require("fs");
const Player = require('./Player.js');
const logger = require("./logger.js")

class PlayerManager {
	constructor(pathToDB) {
		this.pathToDB = pathToDB;
		this.players = this.readDBFile(pathToDB);
		this.currentlyWriting = false;

		this.writeDBFile();
	}

	// get pathToDB() {
	//	 return this.pathToDB;
	// }

	readDBFile(path) {
		var txt = fs.readFileSync(path);
		var content = JSON.parse(txt);

		// Convert the old DB style into the new one
		if (content.hasOwnProperty("players")) {
			content = content.players;
		}
		return content;
	}

	writeDBFile(callback) {
		//write the db in file
		if (!this.currentlyWriting) { // It is unsafe to use fs.writeFile() multiple times on the same file without waiting for the callback. https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback
			this.currentlyWriting = true;
			var beautifulPlayersDB = JSON.stringify(this.players, null, 4);
			fs.writeFile(this.pathToDB, beautifulPlayersDB, 'utf8', (err)=>{
				this.currentlyWriting = false;
				if (err) {
					logger.warn(`Could not write ${path} on disk.`);
					logger.warn(e);
				} else {
					logger.debug("Saved the DB");
				}
				if (callback) {
					callback(err);
				}
			});
		}
	}



}
module.exports = PlayerManager;
