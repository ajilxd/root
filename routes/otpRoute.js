const express =require('express');
const otpRoute = express();

const otpController =require('../controllers/otpController')
otpRoute.get('/',otpController.otpLoader);
otpRoute.post('/',otpController.verifyOtp);
module.exports=otpRoute
