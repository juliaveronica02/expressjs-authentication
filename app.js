var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require("body-parser");
const cors = require('cors')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
app.use(cors())
app.use(logger('dev'));
// body-parser: parse requests of content-type: application/json (to parse incoming data).
app.use(bodyParser.json());
// body-parser: parse requests of content-type: application/x-www-form-urlencoded.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, "public/images")));
app.use(express.static(path.join(__dirname, "public/images/banner130")));
app.use("/public/images", express.static("public/images"));
app.use("/public/images/banner130", express.static("public/images/banner130"));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
