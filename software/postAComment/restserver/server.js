var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var port = process.env.PORT || 9000;
var index = require('./routes/index');
var users = require('./routes/users');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.json({limit: '5mb'})     );
app.use(bodyParser.urlencoded({ limit: '5mb' }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, '../client/app/partials'));
app.set('view engine', 'html');
var extConfigLoc =path.join(__dirname+'/config/config.json');
var config = require(extConfigLoc);
var appConfig = JSON.parse(JSON.stringify(config));
require('./models/db/db')(app, appConfig).then(init);
function init() {
    app.use('/users', users);
    app.use(express.static(path.join(__dirname, '../client')));
    app.use(express.static(path.join(__dirname, '../client/.tmp')));
    app.use(express.static(path.join(__dirname, '../client/app')));
    //var allRoutes = require("./routes/appRoutes");
    app.all('/api/*');
    index(app)
    app.listen(port);
    console.log("app listening to port"+port)
// catch 404 and forward to error handler
    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

// error handler
    app.use(function (err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};
        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });

}
module.exports = app;
