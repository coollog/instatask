var bodyParser = require('body-parser')
var express = require('express')
var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
var test = require('assert');


// Connection url
var mongoURI = 'mongodb://instatask:firstletters@ds059316.mlab.com:59316/instatask';
var userModel = null;
// Connect using MongoClient
MongoClient.connect(mongoURI, function(err, db) {
  userModel = new UserModel(db);
});

var UserModel = function(db) {
  this.collection = db.collection('users');
};
UserModel.prototype.insert = function(name, phone, email) {
  this.collection.insert({
    name: name,
    phone: phone,
    email: email
  }, function(err, result) {
    test.equal(null, err);
  });
};


var app = express();
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.get('/', function(req, res) {
  res.send(fs.readFileSync('register.html', 'utf8'));
});

app.get('/working', function(req, res) {
  res.send(fs.readFileSync('working.html', 'utf8'));
});

app.get('/finishworking', function(req, res) {
  res.send('done');
});

app.get('/workinglocations')

app.post('/register', function(req, res) {
  if (!userModel) res.send('crap');
  userModel.insert(req.body.name, req.body.phone, req.body.email);
  res.send('success');
});

app.listen(3000);