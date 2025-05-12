const { Server } = require('socket.io')
const http = require('http')
const express = require('express')

const app = express()

const server = http.createServer(app)

const io = new Server(server, {
    cors:{origin: ['http://localhost:5173']}
})

function getReceiversSocketId(userId){
    return userSocketmap[userId]
}

const userSocketmap = {}

io.on('connection', (socket)=>{
    console.log('A user is connected', socket.id)
    const userId = socket.handshake.query.userId
    if(userId){
        userSocketmap[userId] = socket.id
    }
    
    io.emit('getOnlineUsers', Object.keys(userSocketmap))

    socket.on('disconnect', ()=>{
        console.log('A user disconnected', socket.id)
        delete userSocketmap[userId]
        io.emit('getOnlineUsers', Object.keys(userSocketmap))
    })
})

module.exports = {
    app, server, io,getReceiversSocketId
}