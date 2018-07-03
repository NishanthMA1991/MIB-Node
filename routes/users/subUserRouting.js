const subRoute = require('express').Router();
const adminRoute = require('./admin/admin');
const userRoute = require('./user/users')

subRoute.use('/admin',adminRoute);
subRoute.use('/user',userRoute);


module.exports = subRoute;