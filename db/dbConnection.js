var appRoot = require('app-root-path');
var mongoose =require('mongoose');
var DBName = require(appRoot+'/config/dbConfig.js');
var config = require('config');

//db options
const options = {
	keepAlive: 1,
	connectTimeoutMS: 30000,
};

//db connection      
// mongoose.connect(DBName.DevDb, options);
console.log("ENV : "+process.env.NODE_ENV);
console.log("data : "+config.DevDb);
mongoose.connect(config.DevDb, options);
// mongoose.connect("mongodb://localhost:27017/testMIBDB", options);
module.exports.db = mongoose.connection;