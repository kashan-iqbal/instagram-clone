const cloundnary = require('cloudinary')
const dotenv = require("dotenv")

dotenv.config()


cloundnary.config({
    api_key: process.env.API_KEY,
    cloud_name: process.env.CLOUD_NAME,
    api_secret: process.env.API_SECRET,
})



module.exports = cloundnary




















