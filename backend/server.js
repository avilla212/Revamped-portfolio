// init server
const express = require('express');
const app = express();
const path = require('path');

// init mongoose
const connectDb = require('./database/db');
const { connect } = require('mongoose');
connectDb();

//  use express.json() middleware to parse JSON request bodies
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.json());

// Mount login route
// Mounting means attaching a route handler to a specific path in the Express application
app.use('/api/login', require('./routes/api/login'));




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

