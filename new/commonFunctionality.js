const commonFunctionality = require('express').Router();
const appRoot = require('app-root-path')
const userRegisterModel =require(appRoot+'/DataModel/UserDetailsSchema');
const logger = require(`${appRoot}/config/winston.config.js`);
const bcrypt = require('bcrypt-nodejs');
const jwt = require(`${appRoot}/jwtAuth/jwtAuth.js`);

//Registering
/* URL : /common/register */
commonFunctionality.post("/register", (req, res) => {

    var userAccount = new userRegisterModel.userAccountDetails;
    userAccount.userName = req.body.email;
    userAccount.createdDate = new Date();
    userAccount.modifiedDate = new Date();
    userAccount.oAuthSource = "",
    userAccount.oAuthID = "",
    userAccount.accountStatusFlag= false,
    userAccount.userType = "U", 
    userAccount.primeUser = false;

    userAccount.password = bcrypt.hashSync(req.body.password,bcrypt.genSaltSync(8),null);
    logger.debug("userAccount : "+userAccount);

    userAccount.save(function(err,data){
        if(err){
            logger.error("there is some exception Occured DUring save User Info",err);
            if(err.errmsg !="" && err.errmsg.indexOf('duplicate key error collection'>0 ))
            {   res.status(500).send("Duplicate key error");    }
            else
            {   res.status(500).send("Database Error");     }
        }else{
            var dataModel = new userRegisterModel.userProfile;
            logger.debug("accountID : ",data._id);
            
            dataModel.fullName = req.body.fullName;
            dataModel.email = req.body.email;
            dataModel.phoneNumber = "";
            dataModel.accountID = data._id;
            dataModel.createdDate = new Date();
            dataModel.modifiedDate = new Date();
            dataModel.primeUser = false;
            dataModel.userStatus = true;
            dataModel.address={
                street: "",
                number: "",
                zip: "",
                city: "",
                state: "",
                country:""
            };

            dataModel.save(function(err1,data1){
                if(err1){
                    logger.error("there is some exception Occured DUring save User Info",err1);
                    if(err1.errmsg !="" && err1.errmsg.indexOf('duplicate key error collection'>0 ))
                    {   res.status(500).send("Duplicate key error");    }
                    else
                    {   res.status(500).send("Database Error");     }
                }else
                {   res.status(200).json(data1);     } 
            })                  
        }
    });
});

//Login
/* URL : /common/login */
commonFunctionality.post("/login", (req, res) => {
    var findData = {userName : req.body.userName };

    userRegisterModel.userAccountDetails.findOne(findData,(err,data)=>{
        if(err)
        {   res.status(500).send("Internal Server Error");    }    
        else {
            if(data)
            {
                bcrypt.compare(req.body.password, data.password, function(err1, result) {
                    // res == true
                    if(err1)
                    {   res.status(500).send("Internal Server Error");    }
                    else if(result)
                    {
                        var token = jwt.generateToken(data);
                        console.log(token);
                        res.header("x_Token",token).status(200).json(token);
                    }
                    else 
                    {   res.status(403).send("Password incorrect !!!");    }
                });
            }
            else
            {   res.status(403).send("User name not found !!!");    }    
           
        }
    })
});

module.exports = commonFunctionality;