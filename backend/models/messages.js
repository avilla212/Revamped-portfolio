// message model for users
const mongoose = require('mongoose');

// ================ message schema ================
// This scheme defines the structure of the message object in the db.
//
// The message object contains the following fields:
// - sender: the username of the sender
// - timestamp: the time the message was sent
// - content: the content of the message
//
// Example:
// <username> 
//                                    <content>
// <timestamp>
// ===================================================

const messageSchema = new mongoose.Schema({
    sender: {
        // username of the sender
        type: String,
        required: true,
    },

    content: {
        // content of the message
        type: String,
        required: true,
    },

    timestamp: {
        // time the message was sent
        type: Date,
        default: Date.now,
    },

})

// Only define the model if it hasnt already been compiled
// This is to prevent the error: "OverwriteModelError: Cannot overwrite Message model once compiled"
const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

module.exports = Message;