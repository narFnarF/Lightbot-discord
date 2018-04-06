"use strict";

class LightGrid {
   constructor(size) {
      this.grid = [];
      for (var x = 0; x<size; x++) {
         this.grid[x] = [];
         for (var y=0; y<size; y++) {
            this.grid[x][y] = "";
         }
      }
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
}


// console.log(new LightGrid(3).grid);
var g = new LightGrid(5);
console.log("(1, 2) =  7 = "+g.xyToIndex(1, 2));
console.log("7ème de 3x3 = (1,2) = "+g.indexToXY(7));
console.log("area = 9 = "+g.area);
console.log("length = 3 = "+g.length);

console.log("g.fillGrid(5, true, false): ");
g.fillGrid(5, true, false);
console.log(g.toString());
