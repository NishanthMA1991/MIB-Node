const userRoute = require('express').Router();
const appRoot = require('app-root-path');
const passport = require('passport');
const logger = require(`${appRoot}/config/winston.config.js`);
const statergy = require(`${appRoot}/config/passport`);
const jwt = require(`${appRoot}/jwtAuth/jwtAuth.js`);
const userRegisterModel = require(appRoot + '/DataModel/UserDetailsSchema');
var ObjectId = require('mongoose').Types.ObjectId;

//Login using gmial
/* URL : /auth/user/statergy */
userRoute.get('/statergy', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

//For gmail login use
userRoute.get('/statergy/redirect', passport.authenticate('google'), (req, res) => {
    var token = jwt.generateToken(req.user);
    console.log("token : " + token);

    var findData = { accountID: req.user._id };

    userRegisterModel.userProfile.findOne(findData, (err, data1) => {
        if (err)
        { res.status(500).json({ 'error': 'Internal Server Error!!!' }); }
        else {
            if (data1) {
                let conURL = "/x_Token/" + token + "/user/" + req.user.userName + "/type/" + req.user.userType + "/id/" + req.user._id + "/fullName/" + data1.fullName;
                res.redirect("http://localhost:4200/home" + conURL);
            }
        }
    });
});

// get user details
/* URL : /auth/user/userdetails */
userRoute.post("/userdetails", (req, res) => {
    var token = req.headers.authentication;
    var returnedToken = jwt.verifyToken(token);

    var id = req.body.userID;
    userRegisterModel.userProfile.findOne({ accountID: id }, (err, userdata) => {
        if (err)
        { res.status(500).json({ 'error': 'Internal Server Error!!!' }); return; }
        else {
            if (userdata) {
                res.status(200).json({ 'data': userdata });
                return;
            }
        }
        res.status(500).json({ 'error': 'Internal Server Error!!!' });
        return;
    });
})

// update user details
/* URL : /auth/user/updateuserdetails */
userRoute.post("/updateuserdetails", (req, res) => {
    var token = req.headers.authentication;
    var returnedToken = jwt.verifyToken(token);

    userRegisterModel.userProfile.findOneAndUpdate({ email_id: req.body.uid }, {
        fullName : req.body.fullName,
        email : req.body.email,
        phoneNumber : req.body.phoneNumber,
        primeUser : false,
        userStatus : false,
        address : {
            street : req.body.street,
            number : req.body.snumber,
            zip : req.body.zip,
            city : req.body.city,
            state : req.body.state,
            country : req.body.country,
        }
    }).then(userData => {
        if(!userData)
        {
            res.status(500).json({ 'error': 'User not updated!!!' });
            return;
        }
        else{
            res.status(200).json({ 'success': 'User updated successfully!!!!' });
            return;
        }
    })
})

module.exports = userRoute;