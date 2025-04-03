const express = require('express'); // Import express to create a router
const router = express.Router(); // Create a new router object
const bcryptjs = require('bcryptjs'); // Import bcryptjs for password hashing and comparison
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for creating JWTstr
const User = require('../../models/user'); // Import the User model to interact with the database

// POST /api/signup
router.post('/', async (req, res) => {
    const {username, password} = req.body; // Destructure the request body to get username and password

    try {
        // Check if username and password are provided
        if (!username) {
            console.log('Username is required');
            return res.status(400).json({message: 'Username is required'});
        }

        if (!password) {
            console.log('Password is required');
            return res.status(400).json({message: 'Password is required'});
        }

        // create jwt 

        // Hash the password using bcryptjs before storing it
        const saltRounds = 10; // Salt rounds for hashing

        // Store the hashed password 
        const hashedPassword = await bcryptjs.hash(password, saltRounds); 

        // Create a new user object
        const newUser = new User({
            username, password: hashedPassword
        })

        console.log(`New user created: ${username}`);
        console.log(`Hashed password: ${hashedPassword}`);

        // Save the new user to the database
        await newUser.save();

        res.status(201).json({message: 'User created successfully'}); // Return success message


    } catch(error){
        // Duplicate username error handling
        if (error.code === 11000){
            console.log('Username already exists');
            return res.status(400).json({message: 'Username already exists'});
        }

        console.error(`Error: ${error.message}`);
        return res.status(500).json({message: 'Server error'});
    }
})

module.exports = router; // Export the router so it can be used in other files