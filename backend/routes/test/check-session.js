const express = require('express'); // Import express to create a new router object
const router = express.Router(); // Create a new router object

router.get('/', (req, res) => {
    console.log(req.session.id); // Log the session ID to the console
    console.log(req.session); // Log the session object to the console

    // This is us modifying the session object to store data
    req.session.visited = true; // Set a session variable named "visited" to true

    res.cookie("hello", "world"); // Set a cookie named "hello" with the value "world"
    res.status(200).json({message: "Session is valid"}); // Send a JSON response indicating that the session is valid
})
module.exports = router; // Export the router object to be used in other files