"use strict";

class LightGrid {
   constructor(size) {
      this.grid = new Array(size).fill(
         new Array(size).fill("o")
      );
   }

   indexToXY(i) {
      if (i%1 != 0) {
         throw notAnInt;
      }
      if (i < Math.pow(this.size,2) && i>=0) {
         var x;
         var y;
         y = Math.floor(i/this.size);
         x = i % this.size;
         return [x, y];
      } else {
         throw outOfGridError
      }
   }

   xyToIndex(x, y) {
      if (x < this.size && y < this.size) {
         return x + y*this.size;
      } else {
         throw outOfGridError;
      }

   }

   get size() {
      return this.grid.length;
   }
}


// console.log(new LightGrid(3).grid);
var g = new LightGrid(3);
console.log("(1, 2) =  7 = "+g.xyToIndex(1, 2));
console.log("7ème de 3x3 = (1,2) = "+g.indexToXY(7));
