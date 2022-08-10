const system = require("../../util/system");

class RouterNode {
    async create(opts){
        let routerStr = `var createError = require('http-errors');
var express = require('express');

var appRouter = express.Router();

appRouter.use('/', require('./routes/index'));
appRouter.use('/users', require('./routes/users'));

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

module.exports = appRouter;`;
        system.writeFile(opts.path.projectApp+'/app.router.js', routerStr);
    }
}

module.exports = new RouterNode();