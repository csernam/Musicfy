'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'secret_key';

exports.ensureAuth = function(req, res, next){
  if(!req.headers.authorization){
    return res.status(403).send({message: 'Authentication header missing'});
  }

  //Clean ' and "
  var token = req.headers.authorization.replace(/['"]+/g, '');

  try{
    var payload = jwt.decode(token, secret);

    if(payload.exp <= moment().unix()){
      return res.status(401).send({message: 'Token is expired'});
    }
  }catch(ex){
    // console.log(ex);
    return res.status(404).send({message: 'Token is not valid'});
  }

  req.user = payload;

  //Exit from middleware
  next();
};
