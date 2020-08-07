const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    email : {
        type : String, 
        required : true, 
        unique : true, 
        match : /^[a-z0-9](?!.*?[^\na-z0-9]{2})[^\s@]+@[^\s@]+\.[^\s@]+[a-z0-9]$/

    }, 
    password : {
        type : String ,
        required : true
    }

})
module.exports = mongoose.model('User', userSchema)