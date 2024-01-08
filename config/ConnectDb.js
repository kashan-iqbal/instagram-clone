const mongoose = require('mongoose')
const dotenv = require ('dotenv')
dotenv.config()



const connectDb =async()=>{
    try {
    const connect = await mongoose.connect(process.env.MONGO_URI)
        console.log(`db is connected ${connect.connection.host}`);
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDb














