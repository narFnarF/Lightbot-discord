"use strict";

var LightGrid = require("./LightGrid.js");
var Jimp = require("jimp");
var Color = require('onecolor');

class LightPicture {
   constructor(size, outputpath, callback){
      this.lightGrid = new LightGrid(size);
      this.picture;
      this.path = outputpath;

      this.constantes = { // TODO: move these as real static constants
         pictureDimention: 500,
         workingDimention: 600
      }

      // console.log(`A new LightPicture of size ${size}.`);
      var actualCellDimention = Math.floor(this.constantes.workingDimention / this.lightGrid.length);
      var actualDimention = this.lightGrid.length * actualCellDimention;
      // console.log(`actual dimention: ${actualDimention} et actual cell dimensions: ${actualCellDimention}.`);

      var rose = Color("rgba(255, 100, 100, 255)")

      // determine the color for this level
      var thisLevelColor
      var level = size-1;
      var a=0.32, c=1.14, b=1, h=20, k=0;
      var luminosity = a*Math.pow(c,(b*(level-h)))+k; //OLD
      var hue = (((size-2)*23.4 % 360) - 360)/360;
      thisLevelColor = rose.hue(hue, true)
         .lightness(luminosity, true)

      // Make the picture
      this.picture = new Jimp(actualDimention, actualDimention, 0xFFFFFFFF, (err, image) => {
         this.lightGrid.forEachFilled( (x, y, i, state) => {
            var startX = x * actualCellDimention;
            var startY = y * actualCellDimention;
            // console.log(`in forEach ${x}, ${y}, ${i}, startX ${startX}, startY ${startY}`);

            // which color are we filling with
            var cellColor
            if (state === LightGrid.FILLED) {
               // console.log(`cell is filled`);
               cellColor = thisLevelColor;
            } else if (state === LightGrid.WINNING) {
               // console.log("cell is winning");
               var extra = Math.random()*0.1
               cellColor = thisLevelColor.lightness(extra, true)
            }

            var colorInRGBA = cellColor.rgb()
            var colorInInt = Jimp.rgbaToInt(colorInRGBA.red()*255, colorInRGBA.green()*255, colorInRGBA.blue()*255, 255)

            // Apply the color in the current cell
            image.scan(startX, startY, actualCellDimention, actualCellDimention, (x, y, index) => {
               image.setPixelColor(colorInInt, x, y)
            });
         });

         image.resize(500, Jimp.AUTO)

         // console.log(`writing to ${this.path}`)
         image.write(this.path, (err, res)=>{
            if (err) {
               if (callback) {
                  callback(err, null);
               }
            } else {
               // console.log("Wrote to "+this.path+".");
               if (callback) {
                  callback(null, this);
               }
            }
         });
         // console.log("3: after asking to write, probably before writing is done");
      });
   }

   get won() {
      return this.lightGrid.won;
   }

}
module.exports = LightPicture;
