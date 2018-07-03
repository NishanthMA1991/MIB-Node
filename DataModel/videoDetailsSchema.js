var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var videoDetailsSchema = new Schema({
    videoDescription:String,
    thumbnails:String,
    videoURL:String,
    videoYtID:{ type:  String, required:  true, unique:  true  },
    videoDuration:String,
    videoTitle:String,
    likes:Number,
    disLikes:Number,
    createdDate:Date,
})

var videoLikeStatusSchema = new Schema({
    videoID:String,
    userID:String,
    likes:Boolean,
    createdDate:Date,
    ModifiedDate:Date
})

var videocommentSchema = new Schema({
    videoID:String,
    userID:String,
    comments:String,
    createdDate:Date,
    ModifiedDate:Date
})
var videoDetailsSchema = mongoose.model('videoDetails', videoDetailsSchema);
var videoLikeStatus = mongoose.model('videoLikeStatus', videoLikeStatusSchema);
var videoComment = mongoose.model('videocommentSchema', videocommentSchema);

module.exports ={
    videoDetailsSchema:videoDetailsSchema,
    videoLikeStatus:videoLikeStatus,
    videoComment:videoComment
}
