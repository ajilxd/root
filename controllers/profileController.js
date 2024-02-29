const profileLoader =async (req,res)=>{
    try{
        res.render('userprofile');
    }catch(error){
        console.log(error.message);
    }
}

const profileLoaderrr =async (req,res)=>{
    try{
        res.render('user');
    }catch(error){
        console.log(error.message);
    }
}

module.exports = {profileLoader,profileLoaderrr}