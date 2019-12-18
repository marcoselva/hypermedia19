const mongoose = require("mongoose");

const Artist = require("../models/artist");

exports.artists_get_all = (req, res, next) => {
  Artist.find()
    .select("name currentAffiliattion achivements isCompany companyMembers type photoGallery photoGallery _id")
    .exec()
    .then(docs => {
      const response = {
        artists: docs.map(doc => {
          return {
            name: doc.name,
            currentAffiliattion: doc.currentAffiliattion,
            achivements: doc.achivements,
            isCompany: doc.isCompany,
            type: doc.type,
            companyMembers: doc.companyMembers,
            photoGallery: doc.photoGallery,
            type: doc.type,
            _id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/artist/" + doc._id
            }
          };
        })
      };
        if (docs.length >= 0) {
          res.status(200).json(JSON.stringify(response));
          } else {
              res.status(404).json({
                  message: 'No entries found'
              });
        }
      })
    .catch(err => {
      console.log("ERROR:\n" + err);
      res.status(500).json({
        error: err
      });
    });
};

exports.artists_create_artist = (req, res, next) => {
  Artist.find({ name: req.body.name })
    .exec()
    .then(art => {
      if (art.length >= 1) {
        return res.status(409).json({
          message: "Artist already exists"
        });
      } else {
        const artist = new Artist({
          _id: new mongoose.Types.ObjectId(),
          name: req.body.name,
          currentAffiliattion: req.body.currentAffiliattion,
          achivements: req.body.achivements,
          isCompany: req.body.isCompany,
          companyMembers: req.body.companyMembers,
          abstract: req.body.abstract,
          type: req.body.type,
          photoGallery: req.file.path
        });
        artist
          .save()
          .then(result => {
            res.status(201).json({
              message: "Created Artist Created",
              createdArtist: {
                _id: result._id,
                name: result.name,
                currentAffiliattion: result.currentAffiliattion,
                isCompany: result.isCompany,
                companyMembers: result.companyMembers,
                abstract: result.abstract,
                type: result.type,
                photoGallery: result.photoGallery,
                request: {
                  type: "GET",
                  url: "http://localhost:3000/artist/" + result._id
                }
              }
            });
          })
        .catch(err => {
          console.log("ERROR:\n" + err);
          res.status(500).json({
            error: err
          });
        });
      }
    });
  };

exports.artists_get_artist = (req, res, next) => {
  const id = req.params.artistId;
  Artist.findById(id)
    .select("name currentAffiliattion achivements isCompany companyMembers  photoGallery photoGallery _id")
    .exec()
    .then(doc => {
      if (doc) {
        res.status(200).json({
          artist: doc,
          request: {
            type: "GET",
            url: "http://localhost:3000/artist/"
          }
        });
      } else {
        res
          .status(404)
          .json({ message: "provided ID artist NOT FOUND" });
      }
    })
    .catch(err => {
      console.log("ERROR:\n" + err);
      res.status(500).json({ error: err });
    });
};

exports.artists_update_artist = (req, res, next) => {
  const id = req.params.artistId;
  const updateOps = {};
  for (const ops of req.body ) {
    updateOps[ops.propName] = ops.value;
  }
  var options = {new: true};
  Artist.findOneAndUpdate({ _id: id }, { $set: updateOps },options,function (err, doc) {  
  })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: "Artist updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/artist/" + id
        }
      });
    })
    .catch(err => {
      if(err.name="CastError"){
        console.log("Artist ID not found");
        res.status(404).json({
          error: "Artist ID not found"
        });
      } else{
        console.log("ERROR:\n" + err);
        res.status(500).json({
          error: err
        });
      }
    });
};

exports.artists_delete = (req, res, next) => {
  const id = req.params.artistId;
  Artist.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Artist deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/artist/",
          body: { name: "String",}
        }
      });
    })
    .catch(err => {
      console.log("ERROR:\n" + err);
      res.status(500).json({
        error: err
      });
    });
};
