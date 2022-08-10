var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/app1', require('./modules/app1/app'));
// app.use('/app2', require('./modules/app2/app'));
// app.use('/app3', require('./modules/app3/app'));
app.use('/schemas', require('./modules/schemas/app'));
// app.use('/social', require('./modules/social/app'));
app.use('/build', require('./modules/buildproject/app'));
app.use('/', require('./app.router'));

module.exports = app;
