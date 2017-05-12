'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//Load routes
var user_routes = require('./routes/user');
var artist_routes = require('./routes/artist');
var album_routes = require('./routes/album');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Headers config

//Base routes
app.use('/api', user_routes);
app.use('/api', artist_routes);
app.use('/api', album_routes);

// app.get('/test', function(req, res){
//   res.status(200).send({message: 'Testing API...'});
// });

module.exports = app;
