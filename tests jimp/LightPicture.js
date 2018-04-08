"use strict";

var LightGrid = require("./LightGrid.js");
var Jimp = require("jimp");

class LightPicture {
   constructor(size, won){
      this.lightGrid = new LightGrid(size);
      this.pictureGrid = [[]];

      this.constantes = {
         pictureDimention: 500,
         workingDimention: 600
      }

      var actualCellDimention = Math.floor(this.constantes.workingDimention / this.lightGrid.length);
      var actualDimention = this.lightGrid.length * actualCellDimention;
      console.log(`actualDimention: ${actualDimention} et actual cell dimensions: ${actualCellDimention}.`);


      this.pictureGrid = new Array(actualDimention);
      for (var x = 0; x < this.pictureGrid.length; x++) {
         this.pictureGrid[x] = new Array(actualDimention);
      }
      // console.log(this.pictureGrid);

      this.lightGrid.forEach( (x, y, i) => {
         console.log(`in forEach ${x}, ${y}, ${i}`);
         var startX = x * actualCellDimention;
         var startY = y * actualCellDimention;
         console.log(`startX ${startX}, startY ${startY}`);

         for (var cellY = startY; cellY < startY+actualCellDimention; cellY++) {
            for (var cellX = startX; cellX < startX+actualCellDimention; cellX++) {
               console.log(`cell ${i} each pixel ${cellX}, ${cellY}`);
            }
         }
      });


   }

}

module.exports = LightPicture;

// Tester cette classe
var p = new LightPicture(7);
