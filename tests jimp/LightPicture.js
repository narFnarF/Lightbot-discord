"use strict";

var qqc = require("./light_Grid.js")

class LightPicture {
   constructor(lg){
      this.lightGrid = lg;
      this.pictureGrid = [];

      this.constantes = {
         pictureDimention: 500,
         workingDimention: 600
      }

      var actualDimention = Math.floor(this.constantes.workingDimention / this.lightGrid.length);
      console.log(actualDimention);
      // for () {
      //
      // }
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
var l = require("./light_Grid.js")(4);
var p = new LightPicture(l);
