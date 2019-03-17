
// init project
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
var shortUrl = require('./models/short');

//Connect to database

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/shortUrls')

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.use(bodyParser.urlencoded({'extended': false}));
app.use(cors());

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

//Using POST to get data from input and manipulate it
app.post('/new', function(req, res){
 
  var short = Math.floor(Math.random()*100000).toString();
  var data = new shortUrl({
    original_url: req.body.url,
    short_url: short
  });
  
  data.save(err=> {
    if(err){
      return err;
    }
  });
  
  return res.json(data);
});

//Check db and forward to original url
app.get('/:urlToSend', function(req, res, next){
  var numberUrl = req.params.urlToSend;
  
  shortUrl.findOne({'short_url' : numberUrl}, function(err, data){
    if(err){
      return err
    }else{
      res.redirect(301, data.original_url);
    }
  })
});



// Answer not found to all the wrong routes
app.use(function(req, res, next){
  res.status(404);
  res.type('txt').send('Not found');
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
