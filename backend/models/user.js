// User model for MongoDB using Mongoose'
const mongoose = require('mongoose');

// Define scheme
const userSchema = new mongoose.Schema({
    // username
    //
    // type: string
    // required: true
    // unique: true
    username: {
        type: String, 
        required: true,
        unique: true
    },

    // password
    //
    // type: String
    // required: true
    password: {
        type: String, 
        required: true
    }
})

// Create the model from schema 
const User = mongoose.model('User', userSchema);

// Export the model so we can use it elsewhere
module.exports = User;