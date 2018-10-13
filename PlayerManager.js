"use strict";

// Dependencies
const fs = require("fs");
const Player = require('./Player.js');
const logger = require("./logger.js");
const {promisify} = require('util');

const writeFilePromisified = promisify(fs.writeFile);

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
		this.needToWriteAgain = false;

		// this.writeDBFile();
	}

	// get pathToDB() {
	//	 return this.pathToDB;
	// }

	readDBFile(path) {
		var content;
		if (fs.existsSync(path)) {
			var txt = fs.readFileSync(path); // Read the file on disk

			// Read the JSON in the file
			try {
				content = JSON.parse(txt);
			} catch (err) {
				logger.error(`The content of the JSON database at "${path}" is not formatted properly. Try to fix the JSON inside.`);
				throw err;
			}

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

	async writeDBFile() {
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
			try {
				await writeFilePromisified(this.pathToDB, beautifulPlayersDB, 'utf8')
				this.currentlyWriting = false;
				logger.debug(`Saved the DB to "${this.pathToDB}"`);
				// If there are more requests to save, we do them!
				if (this.needToWriteAgain) {
					this.needToWriteAgain = false;
					// logger.debug(`needToWriteAgain`);
					this.writeDBFile();
				}

			} catch (e) {
				logger.warn(`Could not write "${this.pathToDB}" on disk.`);
				logger.warn(e);
			}
		} else {
			logger.warn(`Trying to write to "${this.pathToDB}", but i'm actually already writing! Will try again when it's done.`);
			// this.writeQueue.push(callback);
			this.needToWriteAgain = true;
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
				logger.warn(`Found a fake object! (It's not actually a member of class Player):`);
				logger.warn(this.players[userID]);
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

	async levelUpPlayer(id) {
		this.getPlayer(id).increaseLevel(); // do the level up
		await this.writeDBFile();
	}

	async relight(id) {
		this.getPlayer(id).increaseRelightCount();
		await this.writeDBFile();
	}

	async updateLastPlayed(id) {
		this.getPlayer(id).updateLastPlayed();
		await this.writeDBFile();
	}

	async exit() {
		await this.writeDBFile();
	}

	// async writeDBFromContext(context) {
	// 	try {
	// 		return await this.writeDBFile();
	// 	} catch (err) {
	// 		logger.warn(`Error when writing the DB in ${context}.`);
	// 		logger.warn(err);
	// 	}
	// }
}
module.exports = PlayerManager;
