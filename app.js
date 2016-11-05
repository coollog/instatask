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
UserModel.prototype.insert = function(name, pass, phone, email, callback) {
  this.collection.insertOne({
    name: name,
    pass: pass,
    phone: phone,
    email: email
  }, function(err, result) {
    test.equal(null, err);
    callback(result.insertedId);
  });
};
UserModel.prototype.find = function(email, pass, callback) {
  this.collection.findOne({
    email: email,
    pass: pass
  }, function(err, result) {
    test.equal(null, err);
    callback(result._id);
  });
};

function checkLogin(res) {
  if (req.session.user) return true;

  res.send({
    redirect: 'login'
  });
  return false;
}


var app = express();
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
// For sessions.
var session = require('express-session');
app.use(session({
  name: 'server-session-cookie-id',
  secret: 'my express secret',
  resave: true,
  saveUninitialized: true
}));

app.get('/', function(req, res) {

});

app.get('/working', function(req, res) {
  if (!checkLogin(req, res)) return;
  res.send(fs.readFileSync('working.html', 'utf8'));
});

app.get('/finishworking', function(req, res) {
  res.send('done');
});

app.get('/workinglocations');
app.get('/workerlocation');

app.get('/register', function(req, res) {
  res.send(fs.readFileSync('register.html', 'utf8'));
});
app.get('/login', function(req, res) {
  res.send(fs.readFileSync('login.html', 'utf8'));
});

app.post('/register', function(req, res) {
  if (!userModel) {
    return res.send({ error: 'Unexpected error.' });
  }

  var pass = req.body.pass;
  var pass2 = req.body.pass2;

  if (pass != pass2) {
    return res.send({ error: 'Password mismatch.' });
  }

  userModel.insert(
      req.body.name, req.body.pass, req.body.phone, req.body.email,
      function(_id) {
        req.session.user = _id;
        res.send({});
      });
});

app.post('/login', function(req, res) {
  if (!userModel) {
    return res.send({ error: 'Unexpected error.' });
  }

  var email = req.body.email;
  var pass = req.body.pass;

  userModel.find(email, pass, function(_id) {
    req.session.user = _id;
    res.send({});
  });
});

app.listen(3000);