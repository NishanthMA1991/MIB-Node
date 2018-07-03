var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var chatDetailsSchema=new Schema({

question:String,
answer:[String],
hits: {type:Number,default:0 }

})
var chaterBox =  mongoose.model('chaterBox', chatDetailsSchema);

module.exports = {
    chaterBox :   chaterBox
};
