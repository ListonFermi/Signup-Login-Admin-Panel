const mongoose= require('mongoose')

// Defines the structure of document having user details
const userSchema= new mongoose.Schema({
    username: String,
    email: String,
    phonenumber: Number,
    password: String
})

const userCollection= mongoose.model('user', userSchema)

module.exports= userCollection