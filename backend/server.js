const express = require('express')
const authRoute = require('./src/routes/authRoute')
const messageRoute = require('./src/routes/messageRoute')
const dotenv = require('dotenv')
const { connectDb } = require('./src/database/db')
const { logger } = require('./src/middleware/logger')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const { app,server, io } = require('./src/lib/socket')
const path = require('path')

dotenv.config()


const PORT = process.env.PORT

app.use(express.json({limit: '50mb'}))
app.use(cookieParser())
app.use(cors({origin: 'http://localhost:5173', credentials: true}))
app.use(logger)
app.use('/api/auth', authRoute)
app.use('/api/message', messageRoute)

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, '../frontend/dist')))

    app.get('*', (req,res)=>{
        res.sendFile(path.join(__dirname, '../frontend', 'dist', 'index.html'))
    })
}

server.listen(PORT, ()=>{
    console.log('server listening at port 4000')
    connectDb()
})