var appRoot = require('app-root-path');
var winston = require('winston');

var options = {
	file: {
		level: 'info',
		filename: appRoot + '/log/app_info.log',
		handleExceptions: true,
		json: true,
		maxsize: 5242880, // 5MB
		maxFiles: 5,
		colorize: false,
	},
	file_error: {
		level: 'error',
		filename: appRoot + '/log/app_error.log',
		handleExceptions: true,
		json: true,
		maxsize: 5242880, // 5MB
		maxFiles: 5,
		colorize: false,
	},

	console: {
		level: 'debug',
		handleExceptions: true,
		json: false,
		colorize: false,
	},
};
// instantiate a new Winston Logger with the settings defined above

const logger = winston.createLogger({
	level: 'info',
	format: winston.format.json(),
	transports: [
		new winston.transports.File(options.file),
		new winston.transports.File(options.file_error),
		new winston.transports.Console(options.console)
	]
});


// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
	write: function (message, encoding) {
		// use the 'info' log level so the output will be picked up by both transports (file and console)
		logger.info(message);
	},
};

module.exports = logger;