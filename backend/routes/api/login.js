const express = require("express");
const router = express.Router();
const User = require("../../models/user"); // Import the User model
const bcryptjs = require("bcryptjs"); // Import bcryptjs for password hashing

router.post('/', async(req, res) => {
    const { username, password} = req.body;
    
    try {
        // Find user in db 
        const user = await User.findOne({username});
        if (!user) {
            return res.status(401).json({ message: "Invalid username or password" }); // User not found
        }

        const isMatch = await bcryptjs.compare(password, user.password); // Compare password with hashed password
        
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid username or password" }); // Password does not match
        }


        // if valid session, store user ID in session
        req.session.userId = user._id; // Store user ID in session

        return res.status(200).json({ message: "Login successful" }); // Send success response
    } catch (error){
        return res.status(500).json({ message: "Server error" }); // Send server error response
    }
})

module.exports = router; // Export the router