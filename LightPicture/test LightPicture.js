"use strict";

var LightPicture = require("./LightPicture.js");
// var logger = require("winston")


const startLevel = 1;
const endLevel = 20;

for (var i = startLevel; i <= endLevel; i++){
   var lp = new LightPicture(i+1, `output/test${i}.png`, (err, res)=>{
      console.log(`wrote to ${res.path}`);
   });
}
