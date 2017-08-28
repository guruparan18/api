var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

function movieDAO(database) {
    "use strict";
    this.db = database;

    this.getAllMovies = function(callback) {
      "use strict";
      this.db.collection("Movies").find({}).toArray(function(err, docs) {
        assert.equal(null, err);
        callback(docs);
      });
    };

    this.getMovieByName = function(movieName, callback) {
      "use strict";
      this.db.collection("Movies").find({"name":movieName}).toArray(function(err, docs) {
        assert.equal(null, err);
        callback(docs);
      });
    };

    this.putMovie = function(movieName, movieItem, callback){
      "use strict";
      //this.db.collection("Movies").insertOne(movieItem);
      //console.log(movieItem);
      var return_doc = this.db.collection("Movies").update( { name: movieName }
                                         , { $set: { id: movieItem.id
                                                   , displayName : movieItem.displayName
                                                   , displayShortLine: movieItem.displayShortLine
                                                   , actors : movieItem.actors
                                                   , director: movieItem.director
                                                   , poster_url: movieItem.poster_url
                                                   , trailer_url: movieItem.trailer_url}
                                            }
                                           //, $setOnInsert: movieItem }
                                         //, { upsert: true }
                                       );
        console.log(return_doc);
      /*this.db.collection("Movies").find({"name":movieItem.name}).toArray(function(err, docs) {
        assert.equal(null, err);
        callback(docs);
      });*/
    };

    this.postMovie = function(movieItem, callback){
      "use strict";
      this.db.collection("Movies").insertOne(movieItem);
    };

    this.deleteMovie = function(movieName){
      "use strict";
      var return_doc = this.db.collection("Movies").deleteOne({"name":movieName});
      console.log(return_doc);
    };
}

module.exports.movieDAO = movieDAO;
