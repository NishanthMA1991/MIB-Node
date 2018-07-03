
const jwt = require('jsonwebtoken');
const secret = "rXt23s";

module.exports.generateToken = (data)=>{
    //Expire in 1hr
    var token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
        data: data
      }, secret);
    return token;
}

module.exports.verifyToken = (data)=>{
    var token = jwt.verify(data,secret);
    return token;
}
