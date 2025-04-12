const express = require('express');
// We use express.Router() to create a new router object. This object will be used to define our routes and handle requests.
const router = express.Router(); 
const User = require('../../models/user'); // Import the User model to interact with the database
const bcryptjs = require('bcryptjs'); // Import bcryptjs for password hashing and comparison


// POST /api/login 
router.post('/', async (req, res) => {
    const { username, password } = req.body; // Destructure the request body to get username and password

    // Check if username and password are provided
    try {
        // Find the user in the database
        const user = await User.findOne({ username });
        // If user is not found, return 401 Unauthorized
        if (!user) {
            console.log('User not found');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Salt rounds for hashing
        const saltRounds = 10;
        // Hash the password using bcryptjs
        const hashedPassword = await bcryptjs.hash(password, saltRounds);

        // Store the hashed password in the database (this is just for demonstration, normally you would not hash the password again)
        user.password = hashedPassword;

        // Check if the password is correct
        const isMatch = await bcryptjs.compare(password, user.password);
        
        // If password is incorrect, return 401 Unauthorized
        if (!isMatch) {
            console.log('Password is incorrect');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // If username and password are correct, set the session user ID
        req.session.userId = user._id; // Set the session user ID to the user's ID from the database
        
        // If username and password are correct, return success message
        console.log('Login successful');
        return res.status(200).json({ message: 'Login successful' });
    } catch (err){
        console.log(`Error: ${err.message}`);
        // If there is an error, return 500 Internal Server Error
        return res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; // Export the router so it can be used in other files
// This allows us to use this router in our main server file (server.js) by importing it and mounting it on a specific path.
// This way, we can keep our routes organized and modular.