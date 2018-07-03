const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var address = new Schema({
    street: String,
    number: String,
    zip: String,
    city: String,
    state: String,
    country: String
})

var userSchema = new Schema({
    fullName: {
        type: String
    },
    email: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    address: address,
    accountID: String,
    primeUser: {
        type: Boolean
    },
    userStatus: {
        type: Boolean
    },
    createdDate: {
        type: Date, default: Date.now
    },
    modifiedDate: { type: Date, default: Date.now }
})

var AccountSchema = new Schema({
    userName: { type: String, required: true, unique: true },
    password: String,
    oAuthSource: String,
    oAuthID: String,
    accountStatusFlag: Boolean,
    userType: String,
    primeUser: String,
    createdDate: { type: Date, default: Date.now },
    modifiedDate: { type: Date, default: Date.now }
});

// Sets the createdAt parameter equal to the current time
userSchema.pre('save', next   =>   {
    now   =   new   Date();
    if  (!this.createdDate) {
        this.createdDate  = now;
    }
    next();
});

userSchema.pre('update', next   =>   {
    console.log("inside update middleware")
    now   =   new   Date();
    if  (this.createdDate) {
        this.modifiedDate  = now;
    }
    next();
});

var userProfile = mongoose.model('usersProfile', userSchema);
var userAccountDetails = mongoose.model('userAccountDetails', AccountSchema);

module.exports = {
    userProfile: userProfile,
    userAccountDetails: userAccountDetails
}; 