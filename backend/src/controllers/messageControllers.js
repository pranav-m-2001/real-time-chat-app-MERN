const User = require('../models/userModel')
const Message = require('../models/messageModel')
const cloudinary = require('../lib/cloudinary')
const { getReceiversSocketId, io } = require('../lib/socket')

const getUserForSidebar = async (req,res)=>{
    try{

        const loggedUserId = req.user._id
        const filteredUsers = await User.find({_id: {$ne: loggedUserId}}).select('-password')
        return res.status(200).json({success: true, users: filteredUsers})

    }catch(error){
        console.error('Error in getUserForSidebar controller', error.message)
        return res.status(500).json({success: false, message: 'Internal server error'})
    }
}

const getMessages = async (req,res)=>{
    try{

        const { id:userToChatId } = req.params
        const myId = req.user._id
        const messages = await Message.find({$or:[{senderId: myId, receiverId: userToChatId}, {senderId:userToChatId, receiverId:myId}]})
        return res.status(200).json({success: true, messages: messages})

    }catch(error){
        console.error('Error in getMessages controller', error.message)
        return res.status(500).json({success: false, message: 'Internal server error'})
    }
}

const sendMessage = async (req,res)=>{
    try{

        const { text,image } = req.body
        const { id:receiverId } = req.params
        const senderId = req.user._id
        
        let imageUrl
        if(image){
            const upload = await cloudinary.uploader.upload(image)
            imageUrl = upload.secure_url
        }

        const newMessage = new Message({
            senderId: senderId,
            receiverId: receiverId,
            text: text,
            image: imageUrl
        })

        await newMessage.save()

        // Real time functinality
        const receiverSocketId = getReceiversSocketId(receiverId)
        io.to(receiverSocketId).emit('newMessage', newMessage)


        return res.status(201).json({success: true, message: newMessage})

    }catch(error){
        console.error('Error in sendMessage controller', error.message)
        return res.status(500).json({success: false, message: 'Internal server error'})
    }
}

module.exports = {
    getUserForSidebar,getMessages,
    sendMessage,
}