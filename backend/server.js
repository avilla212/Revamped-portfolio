// init server
const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const authMiddleware = require('./middleware/sessionId'); // Import the session middleware

// init mongoose
const connectDb = require('./database/db');
const { connect } = require('mongoose');
const cookieParser = require('cookie-parser');
connectDb();

// Protect all routes with the session middleware
// Middleware here is acting as a checkpoint, the route handler wont be called if the session is not valid
app.get('/homepage_protected.html', authMiddleware, (req, res) => {
    // Now only authenticated users can access this route
    res.sendFile(path.join(__dirname, '../frontend/homepage/homepage_protected.html'));
})

//  use express.json() middleware to parse JSON request bodies
// this ensures that any static files in the frontend are accessible via our public route
// basically, we are saying that everything within our frontend folder should be accessible from the root URL '/'
app.use(express.static(path.join(__dirname, '../frontend'))); 
app.use(express.json());

app.use(cookieParser("Hello world!")) // Use cookie-parser middleware to parse cookies in the request

// Register session middleware
app.use(session({
    secret: 'your_secret_key', // Replace with your own secret key
    saveUninitialized: false, // Don't save uninitialized sessions, this will help to save memory
    resave: false, // Don't resave the session if it hasn't changed 
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // Set the cookie expiration to 1 day (in milliseconds)
    }
}))

// Mount login route
// Mounting means attaching a route handler to a specific path in the Express application
//  This attaches the login.js route to the /api/login, so when we fetch, it will hit our login.js route
app.use('/api/login', require('./routes/api/login'));

// Mount logout route
app.use('/api/logout', require('./routes/api/logout'));

// Mount signup route
app.use('/api/signup', require('./routes/api/signup'));

// Mount test route
app.use('/api/test', require('./routes/test/check-session'))


app.get('/', (req, res) => {
    console.log('Server is running on port 3000');
})

// start server on port 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Press Ctrl+C to stop the server');

});

