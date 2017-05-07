'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getArtist(req, res){
  var artistId = req.params.id;

  Artist.findById(artistId, (err, artist) => {
    if(err){
    res.status(500).send({message: 'Request error'});
  }else{
    if(!artist){
        res.status(404).send({message: 'Artist not found'});
    }else{
        res.status(200).send({artist});
    }
  }
  });
}

function getArtists(req, res){

  var itemsPerPage = 3;

  if(req.params.page){
    var page = req.params.page;
  }else{
    var page = 1;
  }

  Artist.find().sort('name').paginate(page, itemsPerPage, function(err, artists, total){
    if(err){
      res.status(500).send({message: 'Request error'});
    }else{
      if(!artists){
        res.status(404).send({message: 'There are no artists'});
      }else{
        return res.status(200).send({
          total_items: total,
          artists: artists
        });

      }
    }
  });
}

function saveArtist(req, res){
  var artist = new Artist();

  var params = req.body;
  artist.name = params.name;
  artist.description = params.description;
  artist.image = 'null';

  artist.save((err, artistStored) => {
    if(err){
      res.status(500).send({message: 'Error saving artist'});
    }else{
      if(!artistStored){
        res.status(404).send({message: 'Artist could not be saved'});
      }else{
        res.status(200).send({artist: artistStored});
      }
    }
  });
}

function updateArtist(req, res){
  var artistId = req.params.id;
  var update = req.body;

  Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {
    if(err){
      res.status(500).send({message: 'Error updating artist'});
    }else{
      if(!artistUpdated){
        res.status(404).send({message: 'Artist not found'});
      }else{
        res.status(200).send({artist: artistUpdated});
      }
    }
  });
}

function deleteArtist(req, res){
  var artistId = req.params.id;
  Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
    if(err){
      res.status(500).send({message: 'Error removing artist'});
    }else{
      if(!artistRemoved){
        res.status(404).send({message: 'Error: Artist could not be removed'});
      }else{
        Album.find({artist: artistRemoved._id}).remove((err, albumRemoved) => {
          if(err){
            res.status(500).send({message: 'Error removing albums'});
          }else{
            if(!albumRemoved){
              res.status(404).send({message: 'Error: Albums could not be removed'});
            }else{
              Song.find({album: albumRemoved._id}).remove((err, songRemoved) => {
                if(err){
                  res.status(500).send({message: 'Error removing songs'});
                }else{
                  if(!songRemoved){
                    res.status(404).send({message: 'Error: Songs could not be removed'});
                  }else{
                    res.status(200).send({artist: artistRemoved});
                  }
                }
              });
            }
          }
        });
      }
    }
  });
}

function uploadImage(req, res){
  var artistId = req.params.id;
  var filename = 'Not uploaded';

  if(req.files){
    var file_path = req.files.image.path;
    var file_split = file_path.split('/');
    var file_name = file_split[2];

    var ext_split = file_name.split('.');
    var file_ext = ext_split[1];

    if(file_ext == 'png' || file_ext == 'jpeg' || file_ext == 'jpg'){
      Artist.findByIdAndUpdate(artistId, {image: file_name}, (err, artistUpdated) => {
        if(!artistUpdated){
          res.status(404).send({message: 'Artist could not be updated'});
        }else{
          res.status(200).send({artist: artistUpdated});
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
  var path_file = './uploads/artists/'+imageFile;

  fs.exists(path_file, function(exists){
    if(exists){
      res.sendFile(path.resolve(path_file));
    }else{
      res.status(200).send({message: 'Image not found'});
    }
  })
}

module.exports = {
  getArtist,
  saveArtist,
  getArtists,
  updateArtist,
  deleteArtist,
  uploadImage,
  getImageFile
}
