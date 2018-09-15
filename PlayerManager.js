"use strict";

// Dependencies
const Player = require('./Player.js');

class PlayerManager {
   constructor(pathToDB) {
      this.pathToDB = pathToDB;
   }

   get pathToDB() {
      return this.pathToDB;
   }
}
module.exports = PlayerManager;
