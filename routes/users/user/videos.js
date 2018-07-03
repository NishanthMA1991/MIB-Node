const routes = require('express').Router();
const appRoot = require('app-root-path');
const videoDetails = require(appRoot + '/DataModel/videoDetailsSchema');
const logger = require(`${appRoot}/config/winston.config.js`);
const bcrypt = require('bcrypt-nodejs');
const jwt = require(`${appRoot}/jwtAuth/jwtAuth.js`);
var ObjectId = require('mongoose').Types.ObjectId;
var async = require('async');
const userRegisterModel =require(appRoot+'/DataModel/UserDetailsSchema');

var redis = require('redis');
var client = redis.createClient(6379, '127.0.0.1');

var cache = require('express-redis-cache')();  

// get Videos details
/* URL : /videos */
routes.get("/",cache.route('mib:allvideos', 36000) , (req, res) => {
    /*async.parallel({
        videosList:  function  (cb) 
        { 
            logger.info("Inside videosList");
            videoDetails.videoDetailsSchema.find({}).exec(cb); 
        },
        videosLikes:  function (cb) 
        { 
            logger.info("Inside videosLikes");
            videoDetails.videoLikeStatus.find({}).exec(cb); 
        },
        videoComment:  function  (cb) 
        { 
            logger.info("Inside videoComment");
            videoDetails.videoComment.find({}).exec(cb); 
        },
        redis_Like:  function  (cb) 
        { 
            logger.info("Inside redis_Like"); 
            //client.keys(`V_*_Likes`,cb); 
            var jobs = [];
            client.keys('V_*_Likes', function (err, keys) {
                if(keys){
                    async.map(keys, function(key, cb1) {
                       client.get(key, function (error, value) {
                            if (error) return cb1(error);
                            var job = {};
                            job['jobId']=key;
                            job['data']=value;
                            cb1(null, job);
                        }); 
                    }, cb);
                }
            });
        }
        ,
        redis_UnLike:  function  (cb) 
        { 
            logger.info("Inside redis_Like"); 
            //client.keys(`V_*_Likes`,cb); 
            var jobs = [];
            client.keys('V_*_unLikes', function (err, keys) {
                if(keys){
                    async.map(keys, function(key, cb1) {
                       client.get(key, function (error, value) {
                            if (error) return cb1(error);
                            var job = {};
                            job['jobId']=key;
                            job['data']=value;
                            cb1(null, job);
                        }); 
                    }, cb);
                }
            });
        }
    },  function (err,  result) {
        if (err)
        { res.status(500).json({ 'error': 'Internal Server Error!!!' }); }
        else {
            var  playerData = { "videosList": result.videosList, "videosLikes": result.videosLikes, "videoComment": result.videoComment,"redis_Like":result.redis_Like,"redis_UnLike":result.redis_UnLike}
            res.status(200).json({ 'playerData':  playerData });
        }
    });*/

    videoDetails.videoDetailsSchema.find({}, (err, videos) => {
        if (err)
        { res.status(500).json({ 'error': 'Internal Server Error!!!' }); }
        else {
            if (videos) {
                res.status(200).json({ 'videosList': videos });
            }
        }
    })
});

// add comments
/* URL : /videos/comments */
routes.post("/comments", (req, res) => {
    var token = req.headers.authentication;
    var returnedToken = jwt.verifyToken(token);

    var videoComment = new videoDetails.videoComment;
    videoComment.videoID = req.body.videoID;
    videoComment.createdDate = new Date();
    videoComment.ModifiedDate = new Date();
    videoComment.userID = req.body.userID;
    videoComment.comments = req.body.comments;
    
    videoComment.save(function (err, data) {
        if (err) {
            res.status(500).json({ 'error': "Internal server error!!!" });
        } else {
            res.status(200).json({ 'message': 'Comment inserted successfully!!!' });
        }
    });
});

// add likes
/* URL : /videos/likes */
routes.post("/likes", (req, res) => {
    let VId = req.body.videoID;
    var token = req.headers.authentication;
    var returnedToken = jwt.verifyToken(token);

    var videoLikes = new videoDetails.videoLikeStatus;
    videoLikes.videoID = VId;
    videoLikes.createdDate = new Date();
    videoLikes.ModifiedDate = new Date();
    videoLikes.userID = req.body.userID;
    videoLikes.likes = req.body.likes;

    videoDetails.videoLikeStatus.find({ $and: [ { videoID: { $eq: VId } }, { userID: { $eq: req.body.userID } } ] }, (err, videos) => {
        if (err)
        { res.status(500).json({ 'error': 'Internal Server Error!!!' }); }
        else {
            if (videos!="") {
                //update

                var conditions = { $and: [ { videoID: { $eq: VId } }, { userID: { $eq: req.body.userID } } ] } , update = { likes: req.body.likes }
                , options = { multi: true };
              
                videoDetails.videoLikeStatus.update(conditions, update, options, callback);
              
                function callback (err, numAffected) {
                    updateRedisSecondLike(VId);
                    res.status(200).json({ 'message': 'Likes inserted successfully!!!' });
                }
            }
            else{
                //insert

                videoLikes.save(function (err, data) {
                    if (err) {
                        res.status(500).json({ 'error': "Internal server error!!!" });
                    } else {
                        //Cache update
                        updateRedis(VId,`V_${VId}_Likes`);
                        res.status(200).json({ 'message': 'Likes inserted successfully!!!' });
                    }
                });
            }
        }
    })
});

// add unlikes
/* URL : /videos/unlikes */
routes.post("/unlikes", (req, res) => {
    let VId = req.body.videoID;
    var token = req.headers.authentication;
    var returnedToken = jwt.verifyToken(token);

    var videoLikes = new videoDetails.videoLikeStatus;
    videoLikes.videoID = VId;
    videoLikes.createdDate = new Date();
    videoLikes.ModifiedDate = new Date();
    videoLikes.userID = req.body.userID;
    videoLikes.likes = req.body.likes;

    videoDetails.videoLikeStatus.find({ $and: [ { videoID: { $eq: VId } }, { userID: { $eq: req.body.userID } } ] }, (err, videos) => {
        if (err)
        { res.status(500).json({ 'error': 'Internal Server Error!!!' }); }
        else {
            if (videos!="") {
                //update
                var conditions = { $and: [ { videoID: { $eq: VId } }, { userID: { $eq: req.body.userID } } ] } , update = { likes: req.body.likes }
                , options = { multi: true };
              
                videoDetails.videoLikeStatus.update(conditions, update, options, callback);
              
                function callback (err, numAffected) {
                    updateRedisSecondUnLike(VId);
                    res.status(200).json({ 'message': 'DisLike inserted successfully!!!' });
                }
            }
            else{
                //insert
                videoLikes.save(function (err, data) {
                    if (err) {
                        res.status(500).json({ 'error': "Internal server error!!!" });
                    } else {
                        //Cache update
                        updateRedis(VId,`V_${VId}_unLikes`);
                        res.status(200).json({ 'message': 'DisLike inserted successfully!!!' });
                    }
                });
            }
        }
    })
});

function updateRedisSecondUnLike(VId){
    client.get(`V_${VId}_Likes`, function(error, videoslikes) {
        if (videoslikes) {
            let VLikes = parseInt(videoslikes);
            VLikes = VLikes-1;
            client.set(`V_${VId}_Likes`, VLikes, function (error) { });
        }
    })

    client.get(`V_${VId}_unLikes`, function(error, videoslikes) {
        if (videoslikes) {
            let VLikes = parseInt(videoslikes);
            VLikes = VLikes+1;
            client.set(`V_${VId}_unLikes`, VLikes, function (error) { });
        }
        else{
            client.set(`V_${VId}_unLikes`, 1, function (error) { });
        }
    })
}

function updateRedisSecondLike(VId){
    client.get(`V_${VId}_Likes`, function(error, videoslikes) {
        if (videoslikes) {
            let VLikes = parseInt(videoslikes);
            VLikes = VLikes+1;
            client.set(`V_${VId}_Likes`, VLikes, function (error) { });
        }
        else{
            client.set(`V_${VId}_Likes`, 1, function (error) { });
        }
    })

    client.get(`V_${VId}_unLikes`, function(error, videoslikes) {
        if (videoslikes) {
            let VLikes = parseInt(videoslikes);
            VLikes = VLikes-1;
            client.set(`V_${VId}_unLikes`, VLikes, function (error) { });
        }
    })
}

function updateRedis(VId,reference){
    client.get(reference, function(error, videoslikes) {
        if (videoslikes) {
            let VLikes = parseInt(videoslikes);
            VLikes = VLikes+1;
            client.set(reference, VLikes, function (error) { });
        }
        else{
            client.set(reference, 1, function (error) { });
        }
    })
}

// get Videos details
/* URL : /videos/getdetails */
routes.post("/getdetails", (req, res) => {
    var VId = req.body.videoID;
    async.parallel({
        videosLikes:  function (cb) 
        { 
            // if(req.body.userID!=null)
            // {
            //     logger.info("Inside videosLikes");
            //     videoDetails.videoLikeStatus.find({ $and: [ { videoID: { $eq: VId } }, { userID: { $eq: req.body.userID } } ] }).exec(cb); 
            // }
            videoDetails.videoLikeStatus.find({ $and: [ { videoID: { $eq: VId } }, { userID: { $eq: req.body.userID } } ] }).exec(cb);  
        },
        redis_Like:  function  (cb) 
        { 
            client.get(`V_${VId}_Likes`, cb);
        },
        redis_UnLike:  function  (cb) 
        { 
            client.get(`V_${VId}_unLikes`, cb);
        }
    },  function (err,  result) {
        if (err)
        { res.status(500).json({ 'error': 'Internal Server Error!!!' }); }
        else {
            let redis_Like = 0;
            let redis_UnLike = 0;

            if(result.redis_Like != null)
            {   redis_Like = result.redis_Like; }

            if(result.redis_UnLike != null)
            {   redis_UnLike = result.redis_UnLike; }

            var  playerData = {  "videosLikes": result.videosLikes,"redis_Like":redis_Like,"redis_UnLike":redis_UnLike}
            res.status(200).json({ 'videoData':  playerData });
        }
    });

    // videoDetails.videoDetailsSchema.find({}, (err, videos) => {
    //     if (err)
    //     { res.status(500).json({ 'error': 'Internal Server Error!!!' }); }
    //     else {
    //         if (videos) {
    //             res.status(200).json({ 'videosList': videos });
    //         }
    //     }
    // })
});

// function updateRedisLike(VId){
//     client.get(`V_${VId}_Likes`, function(error, videoslikes) {
//         logger.info("Came here2");
//         if (videoslikes) {
//             logger.info("Came here 5");
//             let VLikes = parseInt(videoslikes);
//             VLikes = VLikes+1;
//             logger.info("VLikes : "+VLikes);
//             client.set(`V_${VId}_Likes`, VLikes, function (error) { });
//             return;
//         }
//         else{
//             logger.info("Came here 3");
//             client.set(`V_${VId}_Likes`, 1, function (error) { });
//             return;
//         }
//     })
// }

// get Videos details
/* URL : /videos/getcomments */
routes.post("/getcomments", (req, res) => {
    var data = JSON.parse(JSON.stringify(req.body));
    console.log(data);
    videoDetails.videoComment.find(data, (err,videos) => {
        let userId = [];
        var videosComm=[];
        
        for (i = 0; i <videos.length; i++) {
            userId.push(videos[i].userID.replace(/\"/g, ""));
        }
        userRegisterModel.userProfile.find({accountID: { $in: userId } }, async (error, userData) => {
            
            var jsonVariable = {};
            var fun =  function(){
                for (var index = 0; index <  userData.length; index++) {
                    var id = userData[index].accountID;
                    var name = userData[index].fullName;
                    jsonVariable[id] = name; 
                }
            }
           
            await fun();
            res.status(200).json({ 'videosComments': { 'comment':videos, 'user':jsonVariable} });
        });
    }); 


    // videoDetails.videoComment.find(data, async (err, videos) => {
    //     if (err)
    //     { res.status(500).json({ 'error': 'Internal Server Error!!!' }); }
    //     else {
    //         var videosComm=[];
    //         if (videos) {
    //             console.log("inside");
    //             for (var index = 0; index < videos.length; index++) {
    //                 var videoCommentList = videos[index];
    //                 console.log("videoCommentList : "+videoCommentList);
    //                 var cond = {'accountID':videoCommentList.userID};
    //                 var data = await userRegisterModel.userProfile.findOne(cond);
    //                 if(data)
    //                 {
    //                     var FName = data.fullName;
    //                     console.log("FName : "+FName);
    //                     videosComm.push= {"FName":FName,"userID":videoCommentList.userID,"videoID":videoCommentList.videoID,"comments":videoCommentList.comments}
    //                 }
    //             }
    //             console.log("videosComm : "+videosComm);
    //             res.status(200).json({ 'videosComments': videosComm });
    //         }
    //     }
    // })
});

module.exports = routes;