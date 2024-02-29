const {sendOtp} =require('../middleware/nodemailer');
const Otp =require('../models/otpModel')

const sendOtpMail =async(req,res,next)=>{
    try{
        console.log('session at sendOtpMail',req.session.user);
        await sendOtp(req.session?.user?.email);
        next();
    }catch(error){
        console.log(error)
    }
}

const otpLoader = async (req, res) => {
    try {
        console.log('session at otpLoad', req.session);
        res.render('otp'); 
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
    }
}


const verifyOtp = async (req,res)=>{
    try{
    console.log('session at verifyotp',req.session);
    const userInputOtp = Object.values(req.body).join("");
    console.log(userInputOtp);
    const otpData = await Otp.findOne({email:req.session.user.email});
    if(otpData){
        console.log('found otp db');
    }
    console.log(otpData.otp==userInputOtp);
    if(otpData.otp==userInputOtp){
        res.json(true);
       const otpdeletion= await Otp.deleteOne({email:req.session.user.email});
       if(otpdeletion){
        console.log('otp deletion went succesfull');
       }
    }else{
        res.json(false);
       }
    }catch(error){
        console.log(error.message);
    }
}



module.exports={sendOtpMail,otpLoader,verifyOtp}