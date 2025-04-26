// Instead of constantly passing the sessionId in the request, we can use a middleware to add it to the request object
// and then use it in our routes.

// This way, we can access the sessionId in any route without having to pass it in the request body or headers

module.exports = (req, res, next) => {
  
    if (req.session && req.session.userId) {
      return next();
    }
  
    return res.redirect('/index.html');
  };
  