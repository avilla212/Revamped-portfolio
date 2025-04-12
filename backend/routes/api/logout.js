const express = require('express'); // Import express to create a router
const router = express.Router(); // Create a new router object

router.get('/', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(`Error destroying session: ${err}`); // Log the error if session destruction fails
            return res.status(500).json({message: 'Error destroying session'}); // Send a 500 error response
        } else {
            res.clearCookie('connect.sid'); // Clear the session cookie
            res.status(200).json({message: 'Session destroyed successfully'}); // Send a success response
        }
    })
})

module.exports = router;