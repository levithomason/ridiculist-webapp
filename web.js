var express = require('express');
var http = require('http');
var livereload = require('livereload');
var logfmt = require('logfmt');
var request = require('request');
var bodyParser = require('body-parser');

var slackHelper = require('./slack-helper');
var pkg = require('./package.json');
var inProduction = process.env.NODE_ENV === 'production';

var PROJECT_ROOT = __dirname;
var SERVER_ROOT = PROJECT_ROOT;

////

var app = express();
var PORT = process.env.PORT || 8000;

// Livereload
var lrOptions = {
  exts: [
    'html',
    'css',
    'js',
    'png',
    'gif',
    'jpg',
    'jpeg',
  ],
  exclusions: [
    '.git/',
    '.idea/',
    'app/bower/',
    'node_modules/',
  ],
  applyJSLive: false,
  applyCSSLive: true,
};


/////////////////////////////////////////////////////////////
// SERVER

http.createServer(app).listen(PORT, function() {
  if (inProduction) {
    // keep alive
    setInterval(function() {
      request.get("https://ridiculist.herokuapp.com/");
    }, 300000);
  } else {
    // live reload
    livereload.createServer(lrOptions).watch(SERVER_ROOT);
    console.log('Server listening at http://localhost:' + PORT);
  }
});


/////////////////////////////////////////////////////////////
// Routing


//
// Logger
app.use(logfmt.requestLogger());


//
// Parse Req Body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


//
// Slack
app.post('/slack', function(req, res) {
  var parsed = slackHelper.parseSlashCommand(req.body.text);
  console.log('text:', req.body.text);
  console.log('parsed:', parsed);
  var title = parsed.title;
  var type = parsed.type;
  var items = parsed.items;

  slackHelper.createList(title, type, items, function(err, link) {
    console.log('err:', err, 'link:', link);
    err ? res.status(400) : res.status(200).send(link);
  });
});


//
// Serve Static
app.use('/', express.static(__dirname + '/'));


//
// Angular html5mode
app.all('/*', function(req, res) {
  res.sendFile(__dirname + '/build/index.html');
});
