// Helpers for errors
const createError = require('http-errors');
// Express framework
const express = require('express');
// To create virtual paths
const path = require('path');
// Cookies, yumm!
const cookieParser = require('cookie-parser');
// Dont ask me
const logger = require('morgan');
// HTML compiler
const hbs = require('express-handlebars');
// CSS compiler
const sassMiddleware = require('node-sass-middleware');

// Create the index routes
const indexRouter = require('./routes/index');
// Users routes
const usersRouter = require('./routes/users');

const app = express();

// Set up mongoose connection
const mongoose = require('mongoose');
const mongoDB = 'mongodb://marangoni:m4r4ng0n1@ds045107.mlab.com:45107/node-assets';
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
mongoose.set('useCreateIndex', true);

// Set up handlebars
app.engine('hbs', hbs({
  defaultLayout: 'layout',
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  extname: 'hbs',
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Some express configuration
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set up cookie parser
app.use(cookieParser());
// Set up SASS
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true,
}));

// Set up virtual path
app.use(express.static(path.join(__dirname, 'public')));

// Set up routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('layouts/error');
});

module.exports = app;
