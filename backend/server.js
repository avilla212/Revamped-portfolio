// init server
const express = require('express');
const app = express();
app.use(express.json());

// Basic get request to test server
app.get('/', (req, res) =>{
    res.send('Server is ready!');
})

// Listen to port
app.listen(3000, () => {
    console.log('Server at http://localhost:3000');
})

// port number
const PORT = process.env.PORT || 3000;
