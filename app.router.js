var createError = require('http-errors');
var express = require('express');
var index = require('./routes/index');
var users = require('./routes/users');

var appRouter = express.Router();

appRouter.use('/', index);
appRouter.use('/users', users);

// catch 404 and forward to error handler
appRouter.use(function(req, res, next) {
  next(createError(404));
});

// error handler
appRouter.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = appRouter;
