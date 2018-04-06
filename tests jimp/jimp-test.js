"use strict";

var Jimp = require("jimp");
var logger = require("winston")



// open a file
// Jimp.read("Bot-Test.jpg").then(function (input) {
//     input.resize(256, 256)            // resize
//          .quality(60)                 // set JPEG quality
//          .greyscale()                 // set greyscale
//          .write("bot-test-small-bw.jpg"); // save
//    logger.info("Read and wrote.")
// }).catch(function (err) {
//     logger.error(err);
// });


start()
function start() {
   logger.info("start()");
   const outputpath = "output.png";
   const rose = {r: 255, g:100, b:100, a:255};
   var image = new Jimp(10, 10, 0xFFFFFFFF, (err, image) => {
      // this image is 256 x 256, every pixel is set to 0xFF0000FF
      image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, index) => {
         if ((index/4) %4 == 1) {
            image.bitmap.data[index+0] = rose.r;
            image.bitmap.data[index+1] = rose.g;
            image.bitmap.data[index+2] = rose.b;
            image.bitmap.data[index+3] = rose.a;
         }
      });
      image.resize(500, Jimp.AUTO)
           .write(outputpath);
      logger.info("Wrote to "+outputpath+".");
   });
}



// Bout de code qui remplace une couleur par une autre couleur:
// Jimp.read('Bot-Test.jpg').then(image => {
//   const targetColor = {r: 60, g: 171, b: 118, a: 255};  // Color you want to replace
//   const replaceColor = {r: 0, g: 0, b: 0, a: 0};  // Color you want to replace with
//   const colorDistance = (c1, c2) => Math.sqrt(Math.pow(c1.r - c2.r, 2) + Math.pow(c1.g - c2.g, 2) + Math.pow(c1.b - c2.b, 2) + Math.pow(c1.a - c2.a, 2));  // Distance between two colors
//   const threshold = 50;  // Replace colors under this threshold. The smaller the number, the more specific it is.
//   image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
//     const thisColor = {
//       r: image.bitmap.data[idx + 0],
//       g: image.bitmap.data[idx + 1],
//       b: image.bitmap.data[idx + 2],
//       a: image.bitmap.data[idx + 3]
//     };
//     if(colorDistance(targetColor, thisColor) <= threshold) {
//       image.bitmap.data[idx + 0] = replaceColor.r;
//       image.bitmap.data[idx + 1] = replaceColor.g;
//       image.bitmap.data[idx + 2] = replaceColor.b;
//       image.bitmap.data[idx + 3] = replaceColor.a;
//     }
//   });
//   image.write('transparent.png');
//   logger.info("Wrote transparent.png");
// });
