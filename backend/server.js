const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const session = require("express-session");
const rateLimit = require('express-rate-limit');
const authMiddleware = require("./middleware/sessionId"); // Import the session middleware
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Trust proxy (important for Railway and express-rate-limit)
app.set('trust proxy', 1);

// init mongoose
const connectDb = require("./database/db");
const { connect } = require("mongoose");
const cookieParser = require("cookie-parser");
connectDb();

// CORS middleware setup
const allowedOrigins = [
  "https://revamped-portfolio-ten.vercel.app",
  "http://localhost:3000"
];

const corsOptions = isProduction
  ? {
      origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          console.warn(`🚫 CORS blocked: ${origin}`);
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true
    }
  : {
      origin: true, // Allow all during development
      credentials: true
    };

app.use(cors(corsOptions));

// use express.json() middleware to parse JSON data in request body
app.use(express.json());

// Use cookie-parser middleware to parse cookies in the request
app.use(cookieParser("Hello World!"));


// Determine environment
const isProduction = process.env.NODE_ENV === 'production';

// Register the session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    sameSite: isProduction ? 'none' : 'lax',
    secure: isProduction
  }
}));

// Log session data for debugging (optional)
app.use((req, res, next) => {
  // console.log('Session data:', req.session);
  next();
});

// rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests, try again later.'
});

// Mount the rate limiter
app.use('/api/', apiLimiter);

// Mount login, logout, signup, test, and message routes
app.use('/api/login', require('./routes/api/login'));
app.use('/api/logout', require('./routes/api/logout'));
app.use('/api/signup', require('./routes/api/signup'));
app.use('/api/test', require('./routes/test/check-session'));
app.use('/api/messages', require('./routes/api/messages'));

// Protect homepage route
app.get('/homepage_protected.html', authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/homepage/homepage_protected.html'));
});

// Serve static files from frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Server root route
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
