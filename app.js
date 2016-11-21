var bodyParser = require('body-parser')
var path = require("path");
var express = require('express')
var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var test = require('assert');


// Connection url
var mongoURI = 'mongodb://instatask:firstletters@ds059316.mlab.com:59316/instatask';
var userModel = null;
var taskModel = null;
// Connect using MongoClient
MongoClient.connect(mongoURI, function(err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established to', mongoURI);

    userModel = new UserModel(db);
    taskModel = new TaskModel(db);
  }
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
    if (!result) callback(null);
    else callback(result._id);
  });
};

var TaskModel = function(db) {
  this.collection = db.collection('tasks');
};
TaskModel.prototype.insert = function(
    title, employer, description, latitude, longitude, payment, callback) {
  var task = {
    title: title,
    employer: new ObjectID(employer),
    employee: null,
    description: description,
    latitude: latitude,
    longitude: longitude,
    payment: payment,
    status: 'open'
  };
  this.collection.insertOne(task, function(err, result) {
    test.equal(null, err);
    callback(result.insertedId);
  });
};
TaskModel.prototype.get = function(_id, callback) {
  _id = new ObjectID(_id);
  this.collection.findOne({ _id: _id }, function(err, result) {
    test.equal(null, err);
    callback(result);
  });
};

// TaskModel.prototype.getOpenTasks = function(callback) {
//   _id = new ObjectID(_id);
//   this.collection.findOne({ _id: _id, status: 'open' }, function(err, result) {
//     test.equal(null, err);
//     callback(result);
//   });
// };

TaskModel.prototype.getOpenTasks = function(callback) {
  this.collection.find({ status: 'open' } ).toArray(function(err, documents) {
    callback(documents);
  });
};

TaskModel.prototype.acceptTask = function(_id, employee, callback) {
  _id = new ObjectID(_id);
  employee = new ObjectID(employee);

  var query = { _id: _id, status: 'open' };
  var $set = {
    employee: employee,
    status: 'working'
  };

  this.collection.update(query, { $set: $set }, function(err, result) {
    if (err)
      callback("Connection failed");
    else if (result.result.nModified == 0)
      callback("Task occupied");
    else if (result.result.nModified == 1)
      callback("Task successfully accepted");
    else
      callback("Unknown failure");
  });
};


function checkLogin(req, res) {
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

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'main.html'));
});

app.get('/get_tasks', function(req, res) {
  taskModel.getOpenTasks(function(tasks) {
    res.send(tasks);
  });
});

app.post('/accept_task', function(req, res) {
  var _id = req.body._id;
  var employee = req.session.user;

  taskModel.acceptTask(_id, employee, function(msg) {
    res.send(msg);
  });
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
    if (_id === null) {
      res.send({ error: 'login failed' });
      return;
    }
    req.session.user = _id;
    res.send({});
  });
});

app.post('/getTask', function(req, res) {
  if (!checkLogin(req, res)) return;

  var _id = req.body._id;

  var task = taskModel.get(_id, function(task) {
    res.send(task);
  });
});

app.get('/homeScreen', function(req, res) {
  if (!checkLogin(req, res)) return;

  res.sendFile(path.join(__dirname,'homescreen.html'));
});

app.post('/postTask', function(req, res) {
  if (!checkLogin(req, res)) return;

  var title = req.body.title;
  var employer = req.session.user;
  var description = req.body.description;
  var latitude = req.body.latitude;
  var longitude = req.body.longitude;
  var payment = req.body.payment;

  taskModel.insert(title, employer, description, latitude, longitude, payment,
      function(_id) {
        res.send({ _id: _id });
      });
});

app.listen(process.env.PORT);