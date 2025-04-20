const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const authMiddleware = require("./middleware/sessionId"); // Import the session middleware
require('dotenv').config({ path: path.join(__dirname, '.env') });

// init mongoose 
const connectDb = require("./database/db");
const { connect } = require("mongoose");
const cookieParser = require("cookie-parser");
connectDb();

// use express.json() middleware to parse JSON data in request body
app.use(express.json());

// Use cookie-parser middleware to parse cookiese in the request 
app.use(cookieParser("Hello World!"));

// Register the session middleware
app.use(session({
    secret: process.env.SESSION_SECRET, // Secret key for signing the session ID cookie
    saveUninitialized: false, // Don't create session until something stored
    resave: false, // Don't save session if unmodified
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // Set cookie expiration to 1 day
        sameSite: 'lax', // change to strict in production
        secure: false, // change to true in production
    }
}));

// Log session data for debugging
app.use((req, res, next) => {
    console.log('Session data:', req.session); // Log session data
    console.log("Session secret:", process.env.SESSION_SECRET), // Log the session secret for debugging
    next(); // Call the next middleware or route handler
});

// Mount login routes
app.use('/api/login', require('./routes/api/login'));

// Mount logout route
app.use('/api/logout', require('./routes/api/logout'));

// Mount signup route
app.use('/api/signup', require('./routes/api/signup'));

// Mount test route
app.use('/api/test', require('./routes/test/check-session'));

// Mount messages route
app.use('/api/messages', require('./routes/api/messages'))

// Protecct all routes with session middleware
app.get('/homepage_protected.html', authMiddleware, (req, res) => {
    // Now only authenticated users can access this route
    res.sendFile(path.join(__dirname, '../frontend/homepage/homepage_protected.html'));
});

// Serve static files from the frontend directory
// Basically, we are saying that everything within our frontend folder should be accessible from the root URL '/'
app.use(express.static(path.join(__dirname, '../frontend')));

// Server root test
app.get('/', (req, res) => {
    console.log('Server is running on port 3000');
});

// Start server on port 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Press Ctrl+C to stop the server');
});