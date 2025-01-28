const jwt=require("jsonwebtoken");
const authMiddleware=(req,res,next)=>{
   
    const token =req.headers('Authorization')?.split(" ")[1];
    if(!token){
        return res
        .status(40)
        .json({message:"Access denied,no token is provided"});
    }
    try{ //encript=>jwt.sign ,
        //decode=>jwt.verify
        const dedoded=jwt.verify(token,"secret_key");
        req.user=dedoded
        next()
    }
    catch(error){

        return res.status(401).json({message:"Invalid token"})
    }
    }
module.exports=authMiddleware;
