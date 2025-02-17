const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true,},
    username: {type: String, required: true, unique: true,},
    password: {type: String},
    chatId: {type: String, unique: true,},
    phone: {type: String},
    agree: {type: Boolean},
    approved: {type: Boolean},
    dtApproved: {type: Date},
    apiKey: {type: String},
    secretKey: {type: String},
    obs: {type: String},
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)