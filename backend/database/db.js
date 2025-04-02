// init mongoose
const mongoose = require('mongoose');
require('dotenv').config();

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            // new url parser is to parse the connection string
            // use unified topology is to use the new topology engine
        });
        console.log('MongoDB connected');

        
    } catch(err){
        console.error(err.message);
        // Exit process with failure
        process.exit(1);
    }
};

module.exports = connectDb;