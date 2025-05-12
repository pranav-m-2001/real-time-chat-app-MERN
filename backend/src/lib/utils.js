const jwt = require('jsonwebtoken')

const generateToken = async(userId, res)=>{
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '7d'})
    res.cookie('token', token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: true,
        secure: process.env.NODE_ENV !== 'development'
    })

    return token

}

module.exports = {
    generateToken,
}