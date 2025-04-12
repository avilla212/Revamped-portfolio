// Instead of constantly passing the sessionId in the request, we can use a middleware to add it to the request object
// and then use it in our routes.

// This way, we can access the sessionId in any route without having to pass it in the request body or headers

module.exports = (req, res, next) => {
    if (req.session && req.session.id){
        return next(); // If the session exists, call the next middleware or route handler
    }

    // redirect to login page if session does not exist
    res.redirect('/index.html'); // Redirect to the login page if the session does not exist
}