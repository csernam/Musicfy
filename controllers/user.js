'use strict'

var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');

function pruebas(req, res){
  res.status(200).send({
    message: 'Probando una acción del controlador de usuarios del API rest'
  })
}

function saveUser(req, res){
  var user = new User();

  var params = req.body;

  console.log(params);

  user.name = params.name;
  user.surname = params.surname;
  user.email = params.email;
  user.role = 'ROLE_USER';
  user.image = 'null';

  if (params.password){
    //Encrypt password and save
    bcrypt.hash(params.password, null, null, function(err, hash){
      user.password = hash;
      if (user.name != null && user.surname != null && user.email != null){
        //Save user
        user.save((err, userStored) => {
          if(err){
            res.status(500).send({message: 'Error saving user'});
          }else{
            if(!userStored){
              res.status(404).send({message: 'User NOT saved'});
            }else{
              res.status(200).send({user: userStored});
            }
          }
        });
      }else{
        res.status(200).send({message: 'Missing parameters'});
      }
    });
  }else{
    res.status(200).send({message: 'Enter password'});
  }
}

module.exports = {
  pruebas,
  saveUser
};
