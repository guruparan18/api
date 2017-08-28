var express = require('express'),
    app = express(),
    engines = require('consolidate'),
    bodyParser = require('body-parser'),
    MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

//var cors = require('cors'); app.use(cors());
app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(allowCrossDomain);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

/*app.get('/', function(req, res) {
    res.render('index', {});
});

app.post('/connect', function(req, res, next) {
    var userName = req.body.userName;
    res.redirect('/' + userName);
});
*/

MongoClient.connect('mongodb://localhost:27017/test', function(err, db) {
  assert.equal(null, err);

  app.get('/movies', function(req, res) {
      db.collection('Movies').find({}).toArray(function(err, docs) {
		res.json(docs);
	  });
	});

/*
  app.get('/movies/:movieID', function(req, res) {
      var movieID = parseInt(req.params.movieID);
      console.log("Movie ID: " + movieID);
      db.collection('Movies').find({"id":movieID}).toArray(function(err, docs) {
        console.log(docs);
        res.json(docs);
	  });
	}); */

  app.get('/movies/:movieName', function(req, res) {
      var movieName = (req.params.movieName);
      console.log("Movie Name: " + movieName);
      db.collection('Movies').find({"name":movieName}).toArray(function(err, docs) {
        console.log(docs);
        res.json(docs);
	  });
	});

});

app.listen(3000, function() {
    console.log('Example app listening on port 3000!')
});
