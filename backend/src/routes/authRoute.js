const express = require('express')
const { signup,login,logout,updateProfile,checkAuth } = require('../controllers/authControllers')
const { protectRoute } = require('../middleware/authMiddleware')

const authRoute = express.Router()

authRoute.post('/signup', signup)
authRoute.post('/login', login)
authRoute.post('/logout', logout)

authRoute.put('/update-profile', protectRoute, updateProfile)

authRoute.get('/check', protectRoute, checkAuth)

module.exports = authRoute