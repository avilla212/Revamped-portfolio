// server.js (Final Clean Version)

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();

// Determine environment
const isProduction = process.env.NODE_ENV === 'production';

// Trust proxy for Railway or Vercel
app.set('trust proxy', 1);

// CORS configuration
const allowedOrigins = [
  'https://revamped-portfolio-ten.vercel.app',
  'http://localhost:3000',
  'http://127.0.0.1:5500',
  'http://localhost:8080'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser('Hello World!'));

// Session configuration
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

// Rate limiting for APIs
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests, try again later.'
});

app.use('/api/', apiLimiter);

// =========================
// Static file serving setup
// =========================

app.use('/scripts', express.static(path.join(__dirname, '../frontend/scripts')));
app.use('/styles', express.static(path.join(__dirname, '../frontend/styles')));
app.use('/assets', express.static(path.join(__dirname, '../frontend/assets')));

// Serve frontend root (like Vercel)
app.use(express.static(path.join(__dirname, '../frontend')));

// =========================
// API Routes mounting
// =========================

app.use('/api/login', require('./routes/api/login'));
app.use('/api/logout', require('./routes/api/logout'));
app.use('/api/signup', require('./routes/api/signup'));
app.use('/api/test', require('./routes/test/check-session'));
app.use('/api/messages', require('./routes/api/messages'));

// =========================
// Protected Routes
// =========================

const authMiddleware = require('./middleware/sessionId');

app.get('/homepage_protected.html', authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, 'protected/homepage_protected.html'));
});

// =========================
// Root route (healthcheck)
// =========================

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
