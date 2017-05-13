'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;

mongoose.connect('mongodb://localhost:27017/musicfy', (err, res) => {
  if(err){
    throw err;
  }else{
    console.log("Musicfy connection is up and running...");

    app.listen(port, function(){
      console.log("API server running at http://localhost:" + port);
    })
  }
});
