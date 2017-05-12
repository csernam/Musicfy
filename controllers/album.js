'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getAlbum(req, res){
  var albumId = req.params.id;

  Album.findById(albumId).populate({path: 'artist'}).exec((err, album) => {
    if(err){
      res.status(500).send({message: 'Server error'});
    }else{
      if(!album){
        res.status(404).send({message: 'Album not found'});
      }else{
        res.status(200).send({album});
      }
    }
  });
}

function getAlbums(req, res){
  var artistId = req.params.artist;

  if(!artistId){
    // Get all albums
    var find = Album.find({}).sort('title');
  }else{
    //Get artist's albums
    var find = Album.find({artist: artistId}).sort('year');
  }

  find.populate({path: 'artist'}).exec((err, albums) => {
    if(err){
      res.status(500).send({message: 'Server error'});
    }else{
      if(!albums){
        res.status(404).send({message: 'There are no albums'});
      }else{
        res.status(200).send({albums});
      }
    }
  })
}

function saveAlbum(req, res){
  var album = new Album();

  var params = req.body;
  album.title = params.title;
  album.description = params.description;
  album.year = params.year;
  album.image = 'null';
  album.artist = params.artist;

  album.save((err, albumStored) => {
    if(err){
      res.status(500).send({message: 'Server error'});
    }else{
      if(!albumStored){
        res.status(404).send({message: 'Album could not be saved'});
      }else{
        res.status(200).send({album: albumStored});
      }
    }
  })
}

function updateAlbum(req, res){
  var albumId = req.params.id;
  var update = req.body;

  Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) => {
    if(err){
      res.status(500).send({message: 'Server error'});
    }else{
      if(!albumUpdated){
        res.status(404).send({message: 'Album not found'});
      }else{
        res.status(200).send({album: albumUpdated});
      }
    }
  })
}

function deleteAlbum(req, res){
  var albumId = req.params.id;

  Album.findByIdAndRemove(albumId, (err, albumRemoved) => {
    if(err){
      res.status(500).send({message: 'Error removing album'});
    }else{
      if(!albumRemoved){
        res.status(404).send({message: 'Error: Album could not be removed'});
      }else{
        Song.find({album: albumRemoved._id}).remove((err, songRemoved) => {
          if(err){
            res.status(500).send({message: 'Error removing songs'});
          }else{
            if(!songRemoved){
              res.status(404).send({message: 'Error: Songs could not be removed'});
            }else{
              res.status(200).send({album: albumRemoved});
            }
          }
        });
      }
    }
  });
}

function uploadImage(req, res){
  var albumId = req.params.id;
  var filename = 'Not uploaded';

  if(req.files){
    var file_path = req.files.image.path;
    var file_split = file_path.split('/');
    var file_name = file_split[2];

    var ext_split = file_name.split('.');
    var file_ext = ext_split[1];

    if(file_ext == 'png' || file_ext == 'jpeg' || file_ext == 'jpg'){
      Album.findByIdAndUpdate(albumId, {image: file_name}, (err, albumUpdated) => {
        if(!albumUpdated){
          res.status(404).send({message: 'Album could not be updated'});
        }else{
          res.status(200).send({album: albumUpdated});
        }
      });
    }else{
      res.status(200).send({message: 'Unsupported file extension'});
    }

    // console.log(ext_split);
  }else{
    res.status(200).send({message: 'No image has been uploded'});
  }
}

function getImageFile(req, res){
  var imageFile = req.params.imageFile;
  var path_file = './uploads/albums/'+imageFile;

  fs.exists(path_file, function(exists){
    if(exists){
      res.sendFile(path.resolve(path_file));
    }else{
      res.status(200).send({message: 'Image not found'});
    }
  })
}

module.exports = {
  getAlbum,
  saveAlbum,
  getAlbums,
  updateAlbum,
  deleteAlbum,
  uploadImage,
  getImageFile
}
