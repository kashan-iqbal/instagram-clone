const mongoose = require("mongoose")


const UserSchema = mongoose.Schema({
    userName:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    photo:{
      type:String
    },
    follower:[{type:mongoose.Schema.ObjectId,ref:"USER"}],
    following:[{type:mongoose.Schema.ObjectId,ref:"USER"}]
},{
    timestamps:true
})


module.exports = mongoose.model('USER',UserSchema) 











