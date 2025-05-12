const mongoose = require('mongoose')

const connectDb = async ()=>{
    try{

        const conn = await mongoose.connect(process.env.MONGODB_URL)
        console.log(`MongoDB connected succesfully: ${conn.connection.host}`)

    }catch(error){
        console.error(`MongoDB connection Failed: ${error}`)
    }
}

module.exports = {
    connectDb
}