const express = require("express");
const router = express.Router();
const User = require('../../models/user');

router.get('/', async (req, res) => {
    // check if user is logged in 
    if (!req.session.userId){
        return res.status(401).json({message: "Unauthorized"});
    }

    try {
        // looking up user from session
        const user = await User.findById(req.session.userId).select('username');

        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        return res.status(200).json({
            message: "Session is valid",
            userId: req.session.userId,
            username: user.username,
        })

    } catch (error) {
        return res.status(500).json({message: "Server error"})
    }
})

module.exports = router;