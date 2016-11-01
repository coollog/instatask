var MongoClient = require('mongodb').MongoClient;
var express = require('express');
var app = express();
app.set ('views', __dirname + '/views');
app.set ('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// Connection url
var mongoURI = 'mongodb://instatask:firstletters@ds059316.mlab.com:59316/instatask';
// Connect using MongoClient

MongoClient.connect(mongoURI, function(err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established to', mongoURI);
    var collection = db.collection('task');
    collection.find().toArray(function(err, documents) {
        dbTaskResult = documents.slice();
    });
  }
});

app.get('/', function(req, res){
  res.render('show_jobs.ejs',{dbTaskResult:dbTaskResult})
});

app.listen(3000);
