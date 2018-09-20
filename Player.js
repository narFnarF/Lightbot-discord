"use strict";
const logger = require("./logger.js");

// Dependencies

class Player {
   // constructor(id, name) {
   //    logger.info(`Player constructor with 2 params`)
   //    this.name = name;
   //    this.level = 1;
   //    this.lastPlayed = 0;
   // }

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
         this.win = obj.win;
         this.relight = obj.relight;
      }
   }

   // get name() {
   //    console.log("yo");
   //    return this._name;
   // }
   //
   // set name(newName) {
   //    this._name = newName;
   // }
   //
   // getName(id) {
   //    if (this.hasOwnProperty("name")) {
   //       console.log("1");
   //       return this.name;
   //
   //    } else {
   //       console.log("2");
   //       return this.username;
   //
   //    }
   // }
}
module.exports = Player;
