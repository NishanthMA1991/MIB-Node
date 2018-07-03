var express = require('express');
var fs = require('fs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var multer = require('multer');
var appRoot = require('app-root-path');
var db = require(appRoot + '/db/dbConnection.js');
var ObjectId = require('mongoose').Types.ObjectId; 
var app = express();

var Item = new Schema(
    {
        img:
        { data: Buffer, contentType: String }
    }
);
var Item = mongoose.model('Clothes', Item);


// app.use(multer({
//     dest: './uploads/',
//     rename: function (fieldname, filename) {
//         return filename;
//     },
// }));

/*
var newItem = new Item();
// newItem.img.data = fs.readFileSync("./Text.png")
// newItem.img.contentType = 'image / png';
// newItem.save();

Item.findOne({}, function(err, results){
    // set the http response header so the browser knows this
    // is an 'image/jpeg' or 'image/png'
    //res.setHeader('content-type', results.contentType);
    // send only the base64 string stored in the img object
    // buffer element
    console.log(results.img.data);
});*/

var blob = new Blob();
console.log(blob);
console.log("data saved successfully");