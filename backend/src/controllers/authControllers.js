const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const { generateToken } = require('../lib/utils')
const cloudinary = require('../lib/cloudinary')

const signup = async (req,res)=>{
    try{

        const { fullName,email,password } = req.body

        if(!fullName || !email || !password){
            return res.status(400).json({success: false, message: 'All fields required'})
        }

        if(password.length < 6){
            return res.status(400).json({success: false, message: 'Password must be at least 6 charachters'})
        }

        const user = await User.findOne({email: email})
        if(user){
            return res.status(400).json({success: false, message: 'Email already exists'})
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            fullName: fullName,
            password: hashPassword,
            email: email
        })
        if(newUser){
            generateToken(newUser._id, res)
            await newUser.save()
            return res.status(201).json({success: true, userData: {_id: newUser._id, fullName: newUser.fullName, email: newUser.email, profilePic: newUser.profilePic}})
        }else{
            return res.status(400).json({success: false, message: 'Invalid user data'})
        }

    }catch(error){
        console.error('Error in signup controller', error.message)
        return res.status(500).json({success: false, message: error.message})
    }
}

const login = async (req,res)=>{
    try{

        const { email,password } = req.body
        if(!email || !password){
            return res.status(400).json({success: false, message: 'All fields required'})
        }

        const user = await User.findOne({email: email})
        if(!user){
            return res.status(400).json({success: false, message: 'Inavlid credentials'})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({success: false, message: 'Invalid credentials'})
        }

        generateToken(user._id, res)
        return res.status(200).json({success: true, userData: {_id: user._id, fullName: user.fullName, email: user.email, profilePic: user.profilePic}})

    }catch(error){
        console.error('Error in login controller', error.message)
        return res.status(500).json({success: false, message: 'Internal server error'})
    }
}

const logout = async (req,res)=>{
    try{

        res.cookie('token', '', {maxAge: 0})
        return res.status(200).json({success: true, message:'logout successfully'})

    }catch(error){
        console.error('Error in logout controller', error.message)
        return res.status(500).json({success: false, message: 'Internal server error'})
    }
}

const updateProfile = async (req,res)=>{
    try{
        const { profilePic } = req.body
        const userId = req.user._id
        if(!profilePic){
            return res.status(400).json({success: false, message: 'Profile pic is required'})
        }

        const upload = await cloudinary.uploader.upload(profilePic)
        const updateUser = await User.findByIdAndUpdate(userId, {profilePic: upload.secure_url}, {new: true})
        return res.status(200).json({success: true, userData: updateUser})


    }catch(error){
        console.error('Error in updateProfile controller', error.message)
        return res.status(500).json({success: false, message: 'Internal server error'})
    }
}

const checkAuth = (req,res)=>{
    try{

        return res.status(200).json({success: true, userData: req.user})

    }catch(error){
        console.error('Error in checkAuth contoller', error.message)
        return res.status(500).json({success: false, message: 'Internal server errror'})
    }
}

module.exports = {
    signup,login,logout,
    updateProfile,checkAuth
}