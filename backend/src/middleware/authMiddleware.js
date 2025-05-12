const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const protectRoute = async (req,res,next)=>{
    try{

        const token = req.cookies.token
        if(!token){
            return res.status(401).json({success: false, message: 'Unauthorized --No token provided'})
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET)
        if(!decode){
            return res.status(401).json({success: false, message: 'Unauthorized --No token provided'}) 
        }

        const user = await User.findById(decode.userId).select('-password')
        if(!user){
            return res.status(401).json({success: false, message: 'User not found'}) 
        }

        req.user = user
        next()

    }catch(error){
        console.error('Error in protecRoute', error.message)
        return res.status(500).json({success: false, message: 'Internal server error'})
    }
}

module.exports = {
    protectRoute,
}