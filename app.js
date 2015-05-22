/*
https://developer.github.com/v3/oauth/
http://expressjs.com/starter/generator.html
*/

// express config
var express = require('express');
var path = require('path');
// var favicon = require('static-favicon');
// var methodOverride = require('method-override');
// var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser');

// app setting
var app = express();
// app.set('port', 3030);
app.set('views', __dirname+'/views');
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));

// app.use(favicon());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded());
// app.use(methodOverride());
// app.use(cookieParser());

var routes = require('./routes/index');

app.use('/', routes);

app.listen('3030', function(){
    console.log("server started at 3030");
});

module.exports = app;
