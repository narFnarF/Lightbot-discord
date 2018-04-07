"use strict";

class LightPicture {
   constructor(lg){
      this.lightGrid = lg;
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


   }

   makePicture(level, won) {
      var path = "";
      return path;
   }

   makePictureBase64(level, won) {
      var base64Picture;
      return base64Picture;
   }
}


// Tester cette classe
var LightGrid = require("./LightGrid.js");
var l = new LightGrid(19);
var p = new LightPicture(l);
