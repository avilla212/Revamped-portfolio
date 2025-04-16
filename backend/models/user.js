const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String, 
        required: true, 
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }
})

// Only define the model if it hasnt already been compiled
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User; // Export the User model