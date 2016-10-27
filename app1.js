var express = require("express");
var path = require("path");
var app = express();
var bodyParser = require("body-parser");
var MongoClient = require('mongodb').MongoClient;
var test = require('assert');

// Connection url
var mongoURI = 'mongodb://instatask:firstletters@ds059316.mlab.com:59316/instatask';
var userModel = null;
// Connect using MongoClient
MongoClient.connect(mongoURI, function(err, db) {
  userModel = new UserModel(db);
});


app.use(bodyParser.urlencoded({
	extended: false
}));
//app.use(bodyParser.json());

app.listen(process.env.PORT);

app.get('/',function(req,res){
    res.sendFile(path.join(__dirname,'createTask.html'));
});

app.post('/createTask', function(req,res){
  //  console.log(JSON.stringify(req.body));
    var urlParamString = "jh="+ encodeURIComponent(req.body.job_heading) + "&jd=" + 
                            encodeURIComponent(req.body.job_description) + "&pay=" + encodeURIComponent(req.body.pay);
    res.sendFile(path.join(__dirname,'testgeo.html'));
});

/*
app.get('/getLoc', function(req,res){
   if(req.query.jh)
   
   console.log(req.query.jh);
   console.log(req.query.jd);
   console.log(req.query.pay);
});*/