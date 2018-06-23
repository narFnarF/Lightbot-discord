"use strict";

var LightPicture = require("./LightPicture.js");
// var logger = require("winston")


const startLevel = 1; // How many pictures to ouput
const endLevel = 10;

var i = startLevel;
var id = setInterval(()=>{
   var lp = new LightPicture(i+1, `test${i}.png`, ()=>{
      console.log(`wrote to ${lp.path}`);
   });

   i++;

   if (i > endLevel) {
      clearInterval(id);
   }
}, 200)
