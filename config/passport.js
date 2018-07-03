const passport =  require('passport');
const googleStgy = require('passport-google-oauth20');
const appRoot = require('app-root-path')
const userAcountModel = require(`${appRoot}/DataModel/UserDetailsSchema`);
const keys = require('./keys');
const logger = require(`${appRoot}/config/winston.config.js`);

passport.serializeUser((user,done) =>{
    done(null,user.id);
})

passport.deserializeUser((id,done) =>{
    userAcountModel.userAccount.findById(id,(user)=>{
        done(null,user);
    })
})

passport.use(new googleStgy({
    callbackURL:'/auth/user/statergy/redirect',
    clientID:keys.google.clientID,
    clientSecret:keys.google.clientSecret
}, (accessToken,refreshToken,profile,done) => {
    logger.info("accessToken  :"+accessToken)
    
    userAcountModel.userAccountDetails.findOne({ "oAuthID": profile.id }, function (err, user) {
        logger.info("logger")
        if(user){
            logger.info('User already present');
            done(null,user, { message: 'User Found!!!' })
        }else{
            accountData = {userName:profile.emails[0].value, oAuthSource:profile.provider, oAuthID:profile.id,createdDate : new Date(),modifiedDate : new Date(),accountStatusFlag : false,userType : "U", primeUser : false}
            var newAccount = new userAcountModel.userAccountDetails(accountData);
            newAccount.save((err,adata) => {
                if(err){
                    logger.info('err1 :'+err)
                    return done(null, false, { message: 'Internal Server Error!!!' });
                }else{

                    var address={street: "",number: "",zip: "",city: "",state: "",country:""};

                    var userDetails = {fullName:profile.displayName, accountID:adata._id,email:profile.emails[0].value,phoneNumber : "",createdDate : new Date(),modifiedDate : new Date() , primeUser : false, userStatus : false,address : address}; 
                    var newUser = new userAcountModel.userProfile(userDetails);
                    newUser.save((err,udata) => {
                        if(err){
                            logger.info('err2 :'+err)
                            return done(null, false, { message: 'Internal Server Error!!!' });
                        }else{
                            logger.info('udata :'+udata);
                            done(null,adata);
                        }
                    })
                }
            })
        }
    })
}))