'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//Load routes
var user_routes = require('./routes/user');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Headers config

//Base routes
app.use('/api', user_routes);

// app.get('/test', function(req, res){
//   res.status(200).send({message: 'Testing API...'});
// });

module.exports = app;
