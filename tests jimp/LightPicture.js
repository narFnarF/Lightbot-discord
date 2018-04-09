"use strict";

var LightGrid = require("./LightGrid.js");
var Jimp = require("jimp");

class LightPicture {
   constructor(size){
      this.lightGrid = new LightGrid(size);
      // this.pictureGrid = [[]];
      this.picture;

      this.constantes = {
         pictureDimention: 500,
         workingDimention: 600
      }

      var actualCellDimention = Math.floor(this.constantes.workingDimention / this.lightGrid.length);
      var actualDimention = this.lightGrid.length * actualCellDimention;
      console.log(`actual dimention: ${actualDimention} et actual cell dimensions: ${actualCellDimention}.`);


      const outputpath = "output.png";
      const rose = {r: 255, g:100, b:100, a:255};
      // var color;

      // Make the picture
      this.picture = new Jimp(actualDimention, actualDimention, 0xFFFFFFFF, (err, image) => {
         this.lightGrid.forEachFilled( (x, y, i, state) => {
            var startX = x * actualCellDimention;
            var startY = y * actualCellDimention;
            // console.log(`in forEach ${x}, ${y}, ${i}, startX ${startX}, startY ${startY}`);

            // which color are we filling with
            // var color;
            if (state === LightGrid.FILLED) {
               var color = rose;
            } else if (state === LightGrid.WINNING) {
               var extra = Math.random()*50;
               var rosePale = {
                  r: rose.r,
                  g: rose.g + extra,
                  b: rose.b + extra,
                  a: rose.a
               };
               var color = rosePale;
            }

            image.scan(startX, startY, actualCellDimention, actualCellDimention, (x, y, index) => {
               // console.log("tout dedans");
               image.bitmap.data[index+0] = color.r;
               image.bitmap.data[index+1] = color.g;
               image.bitmap.data[index+2] = color.b;
               image.bitmap.data[index+3] = color.a;
            });
         });
         image.resize(500, Jimp.AUTO)
              .write(outputpath);
         console.log("Wrote to "+outputpath+".");
      });


      // Probably not required either. I could to this straight in the jimp object
      // Initialize an empty array for the picture
      // this.pictureGrid = new Array(actualDimention);
      // for (var x = 0; x < this.pictureGrid.length; x++) {
      //    this.pictureGrid[x] = new Array(actualDimention);
      // }
      // console.log(this.pictureGrid);


      // Pas besoin de ça. Scan le fait pour nous.
      // for (var cellY = startY; cellY < startY+actualCellDimention; cellY++) {
      //    for (var cellX = startX; cellX < startX+actualCellDimention; cellX++) {
      //       console.log(`cell ${i} each pixel ${cellX}, ${cellY}`);
      //    }
      // }

   }

}

module.exports = LightPicture;

// Tester cette classe
var p = new LightPicture(7);
