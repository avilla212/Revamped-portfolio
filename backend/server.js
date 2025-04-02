// init server
const express = require('express');
const app = express();
const path = require('path');

// init mongoose
const connectDb = require('./database/db');
const { connect } = require('mongoose');
connectDb();

//  use express.json() middleware to parse JSON request bodies
// this ensures that any static files in the frontend are accessible via our public route
// basically, we are saying that everything within our frontend folder should be accessible from the root URL '/'
app.use(express.static(path.join(__dirname, '../frontend'))); 
app.use(express.json());

// Mount login route
// Mounting means attaching a route handler to a specific path in the Express application
//  This attaches the login.js route to the /api/login, so when we fetch, it will hit our login.js route
app.use('/api/login', require('./routes/api/login'));

// Mount signup route
app.use('/api/signup', require('./routes/api/signup'));




app.get('/', (req, res) => {
    res.send('Hello World!');
    console.log('Server is running on port 3000');
})

// start server on port 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Press Ctrl+C to stop the server');
});

