const express = require('express'); // Import express to create a router
const router = express.Router(); // Create a new router object
const bcryptjs = require('bcryptjs'); // Import bcryptjs for password hashing and comparison
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

        // Validate the username and password once again
        const usernameRegex = /^[a-zA-Z0-9]{3,20}$/; // Username must be 3-20 characters long and can only contain letters and numbers

        const hasSpaces = /\s/

        if (hasSpaces.test(username)) {
            console.log('Username cannot contain spaces');
            return res.status(400).json({message: 'Username cannot contain spaces'});
        }

        if (!usernameRegex.test(username)) {
            console.log('Username must be 3-20 characters long and can only contain letters and numbers');
            return res.status(400).json({message: 'Username must be 3-20 characters long and can only contain letters and numbers'});
        }

        if (password.length < 8) {
            console.log('Password must be at least 8 characters long');
            return res.status(400).json({message: 'Password must be at least 8 characters long'});
        }

        // Check if password contains at least one uppercase letter, one lowercase letter, one number and one special character
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!passwordRegex.test(password)) {
            console.log('Password must contain at least one uppercase letter, one lowercase letter, one number and one special character');
            return res.status(400).json({message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'});
        }

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

        // Store a new property in the users session that is their unique id that mongodb generated for them
        // Now the userId value lives server side 
        req.session.userId = newUser._id; // Store the user ID in the session

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