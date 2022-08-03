var express = require('express');

var appRouter = express.Router();

// Configuração do contexto
appRouter.use(function(req, res, next) {
  res.locals.appContext = req.baseUrl+'/';
  next();
});

appRouter.use('/', require('./routes/index'));
appRouter.use('/build', require('./routes/build'));

// catch 404 and forward to error handler
appRouter.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
