var express = require('express');
var routes = express.Router();

var path = require('./users/subUserRouting');
var commonFunc = require('./users/common/commonFunctionality');
var player = require('./player/player');
var UpdatePlayersData = require('../cronJob/UpdatePlayersData');
var updateVideosData = require('../cronJob/updateVideosData');
var videos = require('./users/user/videos');
var chat = require('./users/user/chat');
var product = require('./shop/products/product');
var category = require('./shop/categories/category');

routes.use("/auth", path);
routes.use("/common", commonFunc)
routes.use("/players", player)
routes.use("/videos", videos)
routes.use("/chat", chat)
routes.use("/product", product)
routes.use("/category", category)

routes.get("/", (req, res) => {
    console.log("Args ", process.argv)
    const parseArgs = require('minimist')(process.argv.slice(2))
    console.log(parseArgs)

    const IP = parseArgs.ip || "127.0.0.1"
    const PORT = parseArgs.port || 3000

    console.log("Working on ", IP, PORT)
    res.status(200).json({ message: 'Inside The  routes '+IP+' '+PORT });
});


module.exports = routes;