var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const session = require('express-session');
var index = require('./routes/home/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
secret:'aaa',
resave:false,
saveUninitialized:true,
cookie:{}
}));

app.use('/', index);
//app.use('/users', users);
var list = require('./routes/home/list');
app.use('/list',list)
var detail = require('./routes/home/detail');
app.use('/detail',detail);

//登录操作
var user = require('./routes/admin/user');
app.use('/user',user);
//admin index

var admin = require('./routes/admin/admin');
app.use('/admin',admin);

//后台分类操作
var cats = require('./routes/admin/cats');
app.use('/admin/cats',cats);

//后台查看文章操作
var post = require('./routes/admin/post');
app.use('/admin/post',post);

//
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
