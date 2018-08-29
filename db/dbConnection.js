var appRoot = require('app-root-path');
var mongoose =require('mongoose');
var DBName = require(appRoot+'/config/dbConfig.js');
var config = require('config');
const logger = require(`${appRoot}/config/winston.config.js`);
const server = require(`${appRoot}/app.js`).server;

//db options
const options = {
	keepAlive: 1,
	connectTimeoutMS: 30000,
};

//db connection      
console.log("ENV : "+process.env.NODE_ENV);
console.log("data : "+config.DevDb);
mongoose.connect(config.DevDb, options);

mongoose.connection.on('error', function (ex) {
    logger.error("\n Database not connected succesfully!!! \n");
	logger.error(ex);
	server.close();
});
// mongoose.connect("mongodb://localhost:27017/testMIBDB", options);
module.exports.db = mongoose.connection;