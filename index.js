'use strict'

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/musicfy', (err, res) => {
  if(err){
    throw err;
  }else{
    console.log("Musicfy connection is up and running...");
  }
});
