var createError = require('http-errors');
var express = require('express');
var path = require('path');
const passport = require('passport');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var winston = require('./config/winston.config');
var config = require('config');
var appRoot = require('app-root-path');
const cors = require('cors');
var db = require(appRoot + '/db/dbConnection.js');
var routes = require('./routes/routes');
const googleStgy = require('passport-google-oauth20');
var socket = require('socket.io');

var app = express();

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());
app.use(passport.initialize());
//app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('combined', { stream: winston.stream }));
app.use("/", routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

db.db.on('error', console.error.bind(console, 'connection error:'));

if (config.util.getEnv('NODE_DEV') != 'test') {
	app.use(morgan('combined', { stream: winston.stream }));
}

app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	//  this line to include winston logging
	winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

var server = app.listen('3005', '127.0.0.1');
server;
//socket setup
var io = socket(server);

io.on('connection', function (socket) {
	console.log('Socket connection completed');

	socket.on('chat', function (data) {
		//winston.info('data communicated', data)
		io.sockets.emit('chat', data)
	});

	socket.on('join', function (data) {
		socket.join(data.email)
	});
});

module.exports  =  {
	server:  server,
	app:  app
}; 
