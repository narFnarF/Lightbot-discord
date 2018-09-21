"use strict";
const logger = require("./logger.js");

// Dependencies

class Player {
   constructor(obj) {
      // logger.debug(`argument.length: ${arguments.length}`)

      if (arguments.length == 2) {
         var id = arguments[0];
         var name = arguments[1];
         // logger.info(`Player constructor with 2 params: ${id}, ${name}`)
         this.name = name;
         this.level = 1;
         this.lastPlayed = 0;

      } else if (arguments.length == 1) {
         // logger.debug(`Player constructor with just 1 obj param: ${obj}`);
         // console.log(obj);
         this.name = obj.name || obj.username;
         this.level = obj.level;
         this.lastPlayed = obj.lastPlayed;
         this.relight = obj.relight;
      }
      // logger.debug(`Created a new Player:`);
      // console.log(this);
   }

   increaseLevel() {
      this.level++;
   }

   increaseRelightCount() {
      if (this.relight == undefined) {
         this.relight = 1;
      } else {
         this.relight++;
      }

   }

   allowedToPlay() {
      // Returns true if the player hasn't played in the last 5 minutes
      var canPlay = Date.now() > this.lastPlayed + (5*60*1000); //5 minutes, in ms
      return canPlay;
   }

   updateLastPlayed() {
      this.lastPlayed = Date.now();
   }

}
module.exports = Player;
