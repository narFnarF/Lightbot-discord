"use strict";

// Dependencies

class Player {
   constructor(id, name) {
      this.name = name;
   }

   get name() {
      return this.name;
   }
}
module.exports = Player;
