"use strict";

// Dependencies
const fs = require("fs");
const Player = require('./Player.js');
const logger = require("./logger.js")

class PlayerManager {
	constructor(pathToDB, adminID) {
      this.adminID = adminID;
		this.pathToDB = pathToDB;
		this.players = this.readDBFile(pathToDB);
      this.currentlyWriting = false;

		// this.writeDBFile();
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
      // logger.debug(`Reading the DB file. I extracted this:`);
      // console.log(content);

      var listOfActualPlayers = {};
      for (var key in content) {
         // logger.debug(key);
         // console.log(content[key]);
         // listOfActualPlayers[key] = 1 //new Player(content[i])
         content[key] = new Player(content[key]);
      }
      // logger.debug(`Finished reading the DB file. The object I read is:`);
      // console.log(content);
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
      // pm.isAdmin("1234567890")
      return userID == this.adminID;
   }
}
module.exports = PlayerManager;
