const commonFunctionality = require('express').Router();
const appRoot = require('app-root-path');
const userRegisterModel = require(appRoot + '/DataModel/UserDetailsSchema');
const logger = require(`${appRoot}/config/winston.config.js`);
const mail = require(`${appRoot}/config/mail.js`);
const bcrypt = require('bcrypt-nodejs');
const jwt = require(`${appRoot}/jwtAuth/jwtAuth.js`);

//Registering
/* URL : /common/register */
commonFunctionality.post("/register", (req, res) => {
    console.log("Came here inside reg");
    var findData = { userName: req.body.email };
    userRegisterModel.userAccountDetails.findOne(findData, (err, data) => {
        if (err)
        { res.status(500).json(err); }
        else {
            if (data) {
                logger.info("Inside find condition");
                res.status(405).json({ 'error': 'User already exists!!!' });
            }
            else {
                var userAccount = new userRegisterModel.userAccountDetails;
                userAccount.userName = req.body.email;
                //userAccount.createdDate = new Date();
                //userAccount.modifiedDate = new Date();
                userAccount.oAuthSource = "",
                userAccount.oAuthID = "",
                userAccount.accountStatusFlag = false,
                userAccount.userType = "U",
                userAccount.primeUser = false;

                userAccount.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null);
                logger.debug("userAccount : " + userAccount);

                userAccount.save(function (err, data) {
                    if (err) {
                        logger.error("there is some exception Occured DUring save User Info", err);
                        console.log("1111 : " + err.errmsg);
                        if (err.errmsg != "" && err.errmsg.indexOf('duplicate key error collection' > 0))
                        { res.status(405).json(err); }
                        else
                        { res.status(500).json(err); }
                    } else {
                        var dataModel = new userRegisterModel.userProfile;
                        logger.debug("accountID : ", data._id);

                        dataModel.fullName = req.body.fullName;
                        dataModel.email = req.body.email;
                        dataModel.phoneNumber = "";
                        dataModel.accountID = data._id;
                        //dataModel.createdDate = new Date();
                        //dataModel.modifiedDate = new Date();
                        dataModel.primeUser = false;
                        dataModel.userStatus = true;
                        dataModel.address = {
                            street: "",
                            number: "",
                            zip: "",
                            city: "",
                            state: "",
                            country: ""
                        };
                        logger.info("Inserted till here");
                        dataModel.save(function (err1, data1) {
                            if (err1) {
                                logger.error("there is some exception Occured DUring save User Info", err1);
                                console.log(err1.errmsg);
                                if (err1.errmsg != "" && err1.errmsg.indexOf('duplicate key error collection' > 0))
                                { res.status(405).json(err); }
                                else
                                { res.status(500).json(err); }
                            } else {
                                mail.mailOptions.to  = req.body.email;
                                mail.mailOptions.subject  =  'MIB Registration success ';
                                mail.mailOptions.html  =  `<b>Welcome to MiB Fan Club!!!</b>,<br/><br/><br/>Your registeration is successfull. Thanks for beeing the member of MIB.<br/><br/><br/><b>Regards</b><br/><b>MIB</b>`;
                                mail.transporter.sendMail(mail.mailOptions,  function (error,  info) {
                                    if  (error) {
                                        console.log(error);
                                    }  else  {
                                        console.log('Email sent: '  +  info.response);
                                    }
                                });
                                res.status(200).json({ 'success': 'User registered successfully!!!' });
                            }
                        })
                    }
                });
            }

            
        }
    })
});

//Login
/* URL : /common/login */
commonFunctionality.post("/login", (req, res) => {
    var findData = { userName: req.body.email };

    userRegisterModel.userAccountDetails.findOne(findData, (err, data) => {
        if (err)
        { res.status(500).json({ 'error': 'Internal Server Error!!!' }); }
        else {
            if (data) {
                bcrypt.compare(req.body.password, data.password, function (err1, result) {
                    // res == true
                    if (err1)
                    { res.status(500).json({ 'error': 'Internal Server Error!!!' }); }
                    else if (result) {
                        var token = jwt.generateToken(data);
                        console.log(token);

                        var findData = { accountID: data._id };

                        userRegisterModel.userProfile.findOne(findData, (err, data1) => {
                            if (err)
                            { res.status(500).json({ 'error': 'Internal Server Error!!!' }); }
                            else {
                                if (data1) {
                                    res.header("x_Token", token).status(200).json({ 'token': token, 'success': 'Successful', "UserName": data.userName, "Role": data.userType, "id": data._id, "fullName": data1.fullName });
                                }
                            }
                        });
                    }
                    else
                    { res.status(403).json({ 'error': 'Password incorrect !!!' }); }
                });
            }
            else
            { res.status(403).json({ 'error': 'User name not found !!!' }); }
        }
    })
});

module.exports = commonFunctionality;