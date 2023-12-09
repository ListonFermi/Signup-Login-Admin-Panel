const mongoose= require('mongoose')

// Defines the structure of document having admin details
const adminSchema= new mongoose.Schema({
    username: String,
    email: String,
    password: String
})

const adminCollection= mongoose.model('admin', adminSchema)

module.exports= adminCollection