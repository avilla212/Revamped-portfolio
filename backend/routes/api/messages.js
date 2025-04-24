const express = require('express');
const router = express.Router();
const Message = require('../../models/messages');
const User = require('../../models/user');  // import the user model
const { route } = require('./login');

router.post('/', async (req, res) => {
    try{
        // check if user is authenticated 
        if (!req.session.userId){
            return res.status(401).json({messages: `Unauthorized`})
        } 

        const { content } = req.body // parsed information from request

        // validate input
        if (!content || typeof content !== 'string' || content.trim().length === 0){
            return res.status(400).json({ message: `Message content cannot be empty`});
        }

        if (content.length > 200){
            return res.status(400).json({message: `Message too long. Max 200 characters.`});
        }

        // get username from session userId
        const user = await User.findById(req.session.userId).select('username');

        if (!user){
            return res.status(400).json({ message: `User not found`});
        }

        // create and save new message
        const newMessage = new Message ({
            sender: user.username,
            senderId: user._id,
            senderUsername: user.username,
            content: content.trim(),
            createdAt: new Date() // used for TTL to work
        })

        await newMessage.save();

        return res.status(200).json({ message: `Message sent successfully!`});

    } catch(error) {
        console.error(`Error sending message: ${error}`);
        return res.status(500).json({ message: `Server error`});
    }
})

router.get('/', async(req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: 1 }) // get all messaged, sorted oldest to newest
        return res.status(200).json(messages);

    } catch (error){
        console.error(`Error: ${error.message}`);
        return res.status(500).json({ message: 'Server error while fetching messages' })
    }
})

module.exports = router;