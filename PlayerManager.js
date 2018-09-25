"use strict";

// Dependencies
const fs = require("fs");
const Player = require('./Player.js');
const logger = require("./logger.js")

class PlayerManager {
	constructor(pathToDB, adminID) {
		if (!pathToDB) {
			logger.error(`The pathToDB was missing (set to ${pathToDB}). That's bad!`)
			throw (`The pathToDB is missing.`);
		}
		if (!adminID) {
			logger.warn(`The adminID was missing when creating a new PlayerManager at "${pathToDB}"`);
		}

		this.adminID = adminID;
		this.pathToDB = pathToDB;
		this.players = this.readDBFile(pathToDB); // this is done in sync
		this.currentlyWriting = false;
		this.writeQueue = [];

		// this.writeDBFile();
	}

	// get pathToDB() {
	//	 return this.pathToDB;
	// }

	readDBFile(path) {
		var content;
		if (fs.existsSync(path)) {
			var txt = fs.readFileSync(path);
			content = JSON.parse(txt);
		} else {
			content = {};
		}

		// Convert the old DB style into the new one
		if (content.hasOwnProperty("players")) {
			content = content.players;
		}

		// convert untyped objects in Content into a Player type
		for (var key in content) {
			content[key] = new Player(content[key]);
		}
		return content;
	}

	writeDBFile(callback) {
		//write the db in file
		if (!this.currentlyWriting) { // It is unsafe to use fs.writeFile() multiple times on the same file without waiting for the callback. https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback
			this.currentlyWriting = true;

			// Prepare the json string to write
			var beautifulPlayersDB = JSON.stringify(this.players, null, 4);
			if (!beautifulPlayersDB) { // if the json string is empty for some reason
				logger.debug(`I'm about to write but beautifulPlayersDB is empty. Here's the object:`);
				console.log(this.players);
				throw `beautifulPlayersDB is empty!`;
			}

			// write the json file
			fs.writeFile(this.pathToDB, beautifulPlayersDB, 'utf8', (err)=>{
				this.currentlyWriting = false;
				if (err) {
					logger.warn(`Could not write "${this.pathToDB}" on disk.`);
					logger.warn(e);
				} else {
					logger.debug(`Saved the DB to "${this.pathToDB}"`);
				}

				if (callback) {
					callback(err);
				}

				// If there are more requests to save, we do them!
				if (this.writeQueue.length > 0) {
					// logger.debug(`writeQueue lenght: ${this.writeQueue.length}`);
					var nextCallback = this.writeQueue.shift();
					this.writeDBFile(nextCallback);
				}
			});
		} else {
			logger.warn(`Trying to write to "${this.pathToDB}", but i'm actually already writing! Will try again when it's done.`);
			this.writeQueue.push(callback);
		}
	}

	createPlayer(userID, name) {
		var player = new Player(userID, name);
		this.players[userID] = player;
		// console.log(player);
		return player;
	}

	exists(userID) {
		// return true if the player exists in the DB
		if (this.players[userID] == null) {
			return false;
		} else {
			return true;
		}
	}

	getPlayer(userID) {
		// Returns the player with this userID
		// Returns undefined if the player doesn't exist

		// logger.info(`Getting player ${userID}`)
		if (this.exists(userID)) {
			if (this.players[userID] instanceof Player) {
				return this.players[userID];
			} else {
				logger.warn(`Found a fake object!`);
				return undefined;
			}
			// logger.info(`Found it. Is it a member of Player? ${this.players[userID] instanceof Player}`)
		} else {
			return undefined;
		}
	}

	getOrCreatePlayer(userID, username) {
		if (this.exists(userID)) {
			return this.getPlayer(userID);
		} else {
			return this.createPlayer(userID, username);
		}
	}

	isAdmin(userID) {
		// Returns true if the id is the same as the admin's id.
		// usage: pm.isAdmin("1234567890")

		var res = (userID == this.adminID);
		// logger.debug(`Checking if ${userID} is an admin. The admin is ${this.adminID} so it is ${res}.`)
		return res;
	}

	levelUpPlayer(id) {
		this.getPlayer(id).increaseLevel(); // do the level up
		this.writeDBFile((err)=>{ // then save the DB
			if (err) { logger.warn(`Error when writing the DB in levelUpPlayer.`); }
		});
	}

	relight(id) {
		this.getPlayer(id).increaseRelightCount();
		this.writeDBFile((err)=>{ // then save the DB
			if (err) { logger.warn(`Error when writing the DB in PlayerManager's relight().`); }
		});
	}

	updateLastPlayed(id) {
		this.getPlayer(id).updateLastPlayed();
		this.writeDBFile((err)=>{ // then save the DB
			if (err) { logger.warn(`Error when writing the DB in PlayerManager's updateLastPlayed().`); }
		});
	}
}
module.exports = PlayerManager;
