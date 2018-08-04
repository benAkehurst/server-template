'use strict';

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var mongo = require('./db/mongooseInit');
var apiRoutes = require('./api/routes/apiRoutes');
var fs = require('fs');
var axios = require('axios');
var cors = require('cors');

var app = express();

var accessLogStream = fs.createWriteStream(path.join(__dirname, '/logs/access.log'), { flags: 'a' });
app.use(logger('remote-addr - :remote-user [:date[clf]] \
":method :url HTTP/:http-version" :status :res[content-length] \
":referrer" ":user-agent" :response-time ms', {
    stream: accessLogStream,
    skip: function (req, res) {
      return req.url.startsWith('/test');
    }
  }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(cors());
// this line must be immediately after any of the bodyParser middlewares!
app.use(expressValidator());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/', express.static(__dirname + '/webApidoc'));
app.use('/api/', apiRoutes);

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'));
app.use('/static', express.static(__dirname + '/public'));
app.use('/api', express.static(__dirname + '/apiweb'));


var admin = require('./admin/routes/routes');
app.use("/admin/", admin);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handler
app.use(function (err, req, res, next) {

  if (err) {
    var status = 400;
    if (err.status) {
      status = err.status;
    }
    res.status(status).json({ error: err.message });
  }
});

module.exports = app;
