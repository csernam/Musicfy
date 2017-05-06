'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//Load routes

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Headers config

//Base routes
app.get('/test', function(req, res){
  res.status(200).send({message: 'Testing API...'});
});

module.exports = app;
