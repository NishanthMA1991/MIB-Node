const userRoute = require('express').Router();
const appRoot = require('app-root-path');
const PlayerDatabaseSchema =require(appRoot+'/DataModel/PlayerDatabaseSchema');

const logger = require(`${appRoot}/config/winston.config.js`);
var ObjectId = require('mongoose').Types.ObjectId; 
var cache = require('express-redis-cache')();  

//Get players list
/* URL : /players/ */
userRoute.get('/' ,cache.route('mib:allPlayers', 36000) , (req, res) => {
    PlayerDatabaseSchema.playerDetails.find({}, (errPlayer, players) => {
        res.status(200).json({ 'players': players});
    });
});

//Get players list
/* URL : /players/id */
userRoute.get('/:id', (req, res) => {
    var pid = req.params.id;
    PlayerDatabaseSchema.playerDetails.find({ _id:  new ObjectId(pid)  }, (errPlayer, players) => {
        if (players.length !== 0) {
            PlayerDatabaseSchema.tTwenty.find({ playerID: pid }, (errT20, t20) => {
                PlayerDatabaseSchema.oneDayInternational.find({ playerID: pid }, (errOdi, odi) => {
                    PlayerDatabaseSchema.testMatch.find({ playerID: pid }, (errTest, test) => {
                        res.status(200).json({ 'players': players, 't20': t20, 'odi': odi, 'test': test });
                        return;
                    });
                });
            });
        } else {
            res.status(405).json({ 'error': 'no such player found!!' });
            return;
        }
    });
});

module.exports = userRoute;