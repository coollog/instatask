var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var express = require('express');
var bodyParser = require('body-parser')
var app = express();
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.set ('views', __dirname + '/views');
app.set ('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// Connection url
var mongoURI = 'mongodb://instatask:firstletters@ds059316.mlab.com:59316/instatask';
// Connect using MongoClient
var collection;
var dbTaskResult;

MongoClient.connect(mongoURI, function(err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established to', mongoURI);
    collection = db.collection('task');
    collection.find({ status: "New" } ).toArray(function(err, documents) {
        dbTaskResult = documents.slice();
    });
  }
});

app.get('/', function(req, res){
  collection.find({ status: "New" } ).toArray(function(err, documents) {
        dbTaskResult = documents.slice();
    });
  res.render('show_jobs.ejs',{dbTaskResult:dbTaskResult})
});

app.post('/accept_job', function (req, res) {  
  //console.log(req.body.id);
  collection.update({ _id: ObjectID(req.body.id), "status": "New" }, 
      { $set: { employee: req.body.employee, status: "Working" } }, 
      function(err,result){
        if (err) res.send("Connection failed");  
        else if (result.result.nModified == 0) res.send("Task occupied");
        else if (result.result.nModified == 1) res.send("Task successfully accepted");
        else res.send("Unknown failure");
  });

});

app.listen(3000);
