"use strict";

const NOT_FILLED = 0;
const FILLED = 1;
const WINNING = 3;

class LightGrid {
   // constantes
   static get NOT_FILLED() {return NOT_FILLED;}
   static get FILLED() {return FILLED;}
   static get WINNING() {return WINNING;}

   constructor(size) {
      this.grid;
      this.won = false;

      // init the empty grid
      this.grid = [];
      for (var x = 0; x<size; x++) {
         this.grid[x] = new Array(size);
         // for (var y=0; y<size; y++) {
         //    this.grid[x][y] = "";
         // }
      }

      // Determine how many cells will be lit
      var level = size-1;
      var rollMax = Math.ceil(level+(3/level)-1);
      var roll = 1+Math.floor(Math.random()*rollMax);
      var cellLit;
      // console.log(`roll == rollMax: ${roll} == ${rollMax}`);
      if (roll == rollMax) { // win!!
         // console.log("WINNING!!!!!!");
         this.won = true;
         cellLit = this.area;
         this.fillGrid(cellLit, LightGrid.WINNING, LightGrid.NOT_FILLED);

      } else { // don't win
         // console.log("not winning");
         cellLit = 1+Math.floor(Math.random()*(this.area-1));
         this.fillGrid(cellLit, LightGrid.FILLED, LightGrid.NOT_FILLED);
      }
      // console.log(this.grid);
   }

   indexToXY(i) {
      if (i%1 != 0) {
         throw notAnInteger;
      }
      if (i < this.area && i>=0) {
         var x;
         var y;
         y = Math.floor(i/this.length);
         x = i % this.length;
         return [x, y];
      } else {
         throw outOfGridError
      }
   }

   xyToIndex(x, y) {
      if (x < this.length && y < this.length) {
         return x + y*this.length;
      } else {
         throw outOfGridError;
      }

   }

   get length() {
      return this.grid.length;
   }

   get area() {
      return Math.pow(this.grid.length, 2);
   }

   cellXY(x, y) {
      return this.grid[y][x];
   }

   cellAt(i) {
      var pos = indexToXY(i);
      var x = pos[0];
      var y = pos[1];
      return this.cellXY(x, y);
   }

   setCellXY(x, y, value) {
      this.grid[y][x] = value;
   }

   setCellAt(i, value) {
      var pos = this.indexToXY(i);
      var x = pos[0];
      var y = pos[1];
      this.setCellXY(x, y, value);
   }

   fillGrid(n, a, b) { // fills n random cells of the grid with a. The others with b
      // TODO some verifications about size and outOfGridError
      var randomList = [];

      // Generate a list of random index positions in the grid (only once each)
      for (var i = 0; i<this.area; i++) {
         var randomPosition = Math.floor(Math.random()*(randomList.length+1));
         randomList.splice(randomPosition, 0, i); // insert i à un position random dans la liste
      }
      // console.log(randomList);

      // Set chosen cells to their special value
      for (var i = 0; i < randomList.length; i++) {
         if (i < n) {
            this.setCellAt(randomList[i], a);
         } else {
            this.setCellAt(randomList[i], b);
         }
         // this.setCellAt(randomList[i], a);
      }
   }
   toString() {
      var out = "";
      for (var y=0; y<this.length; y++){
         for (var x=0; x<this.length; x++) {
            out += this.cellXY(x, y);
         }
         out += "\n";
      }
      return out;
   }

   forEachFilled(callbackFunction) {
      for (var y = 0; y < this.length; y++) {
         for (var x = 0; x < this.length; x++) {
            // console.log(`Looking at x,y: ${x} ${y}`);
            // console.log(`if ${this.cellXY(x, y)} === ${LightGrid.FILLED}`);
            switch ( this.cellXY(x, y) ) { //If the cell is either filled or winning
               case LightGrid.FILLED :
               case LightGrid.WINNING :
                  // console.log(`I'm filled! ${x} ${y}`);
                  var i = this.xyToIndex(x, y);
                  callbackFunction(x, y, i, this.cellXY(x, y));
            }
         }
      }
   }

}
module.exports = LightGrid;
