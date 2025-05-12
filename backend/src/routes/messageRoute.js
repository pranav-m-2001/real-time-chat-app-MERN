const express = require('express')
const { protectRoute } = require('../middleware/authMiddleware')
const { getUserForSidebar,getMessages,sendMessage } = require('../controllers/messageControllers')

const messageRoute = express.Router()

messageRoute.get('/users', protectRoute, getUserForSidebar)
messageRoute.get('/:id', protectRoute, getMessages)
messageRoute.post('/send/:id', protectRoute, sendMessage)

module.exports = messageRoute