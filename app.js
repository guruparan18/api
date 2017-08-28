var express = require('express')
    , bodyParser = require('body-parser')
    , MongoClient = require('mongodb').MongoClient
    , assert = require('assert')
    , movieDAO = require('./movies').movieDAO
    ;

// Set up express
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.sendStatus(200);
    }
    else {
      next();
    }
};

app = express();
//app.engine('html', engines.nunjucks);
app.set('view engine', 'text');
app.use(express.static('public'));
app.use(allowCrossDomain);
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: true }));


//res.set('Content-Type', 'text/plain');
MongoClient.connect('mongodb://localhost:27017/release', function(err, db) {
    "use strict";

    assert.equal(null, err);
    console.log("Successfully connected to MongoDB.");

    var movies = new movieDAO(db);
    var router = express.Router();

    // Get all movies
    router.get("/movies", function(req, res) {
        "use strict";

        movies.getAllMovies(function(movieItems) {
          res.json(movieItems);
        });
    });

    //Get a movie
    router.get("/movies/:movieName", function(req, res) {
        "use strict";
        var movieName = req.params.movieName;

        movies.getMovieByName(movieName, function(movieItem){
          res.json(movieItem);
        });
    });

    //POST a movie
    router.post("/movies", function(req, res) {
        "use strict";

        movies.postMovie(req.body, function(movieItem){
          res.json(movieItem);
        });
    });

    //EDIT a movie
    router.put("/movies/:movieName", function(req, res) {
        "use strict";

        var movieName = req.params.movieName;
        movies.putMovie(movieName, req.body, function(movieItem){
          res.json(movieItem);
        });
    });

    //DELETE a MOVIE
    router.delete("/movies/:movieName", function(req, res) {
        "use strict";

        var movieName = req.params.movieName;
        movies.deleteMovie(movieName);
    });

    //POST a movie
    router.post("/testpost", function(req, res) {
        "use strict";
        // console.log(JSON.stringify(req.body));
        var retData = {"RETURN_STATUS" : "OK"}
        res.json(retData);
    });

    // Use the router routes in our application
    app.use('/', router);
    app.use(allowCrossDomain);
    // Start the server listening
    var server = app.listen(3000, function() {
        var port = server.address().port;
        console.log('Mongomart server listening on port %s.', port);
    });
});
