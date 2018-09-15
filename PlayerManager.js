"use strict";

// Dependencies
const fs = require("fs");
const Player = require('./Player.js');

class PlayerManager {
   constructor(pathToDB) {
      this.pathToDB = pathToDB;
      this.players = this.readDBFile(pathToDB);
   }

   // get pathToDB() {
   //    return this.pathToDB;
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
}
module.exports = PlayerManager;
