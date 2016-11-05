var express = require("express");
var path = require("path");
var app = express();
var bodyParser = require("body-parser");
var MongoClient = require('mongodb').MongoClient;
var test = require('assert');

// Connection url
var mongoURI = 'mongodb://instatask:firstletters@ds059316.mlab.com:59316/instatask';

app.use(bodyParser.urlencoded({
	extended: false
}));
//app.use(bodyParser.json());

app.listen(process.env.PORT);

app.get('/',function(req,res){
    res.sendFile(path.join(__dirname,'createTask.html'));
});

app.get('/taskSuccess',function(req,res){
    res.sendFile(path.join(__dirname,'taskCreateSuccess.html'));
});

app.post('/postTask', function(req,res){
    console.log(JSON.stringify(req.body));
    MongoClient.connect(mongoURI, function(err, db) {
    if(err)
    {
        console.log("Error connecting to DB",err);
    }
    else
    {
        console.log("Connected to DB");
        var task = {
            title: req.body.jobHeading,
            employer: "N/A",
            employee: null,
            description: req.body.jobDesc,
            latitude: req.body.lat,
            longitude: req.body.lng,
            payment: req.body.pay,
            status: "open"
        }
        db.collection('tasks').insertOne(task);   
    }
    db.close();
});
    console.log("Success");
});
