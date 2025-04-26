const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const path = require('path');
const mongoose = require('mongoose'); 
const authMiddleware = require('./middleware/sessionId'); 
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})



// CORS middleware
app.use(cors(corsOptions));

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser("Hello World!"));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    sameSite: isProduction ? 'none' : 'lax',
    secure: isProduction
  }
}));

// Rate limiter
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, try again later.'
}));

// ✅ Serve static files for frontend BEFORE anything else
app.use('/scripts', express.static(path.join(__dirname, '../frontend/scripts')));
app.use('/styles', express.static(path.join(__dirname, '../frontend/styles')));
app.use('/assets', express.static(path.join(__dirname, '../frontend/assets')));
app.use(express.static(path.join(__dirname, '../frontend'))); // ✅ Allow Vercel-like root paths

// ✅ Mount API routes
app.use('/api/login', require('./routes/api/login'));
app.use('/api/logout', require('./routes/api/logout'));
app.use('/api/signup', require('./routes/api/signup'));
app.use('/api/test', require('./routes/test/check-session'));
app.use('/api/messages', require('./routes/api/messages'));

// ✅ Protect homepage AFTER static serving
app.get('/homepage_protected.html', authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, 'protected/homepage_protected.html'));
});

// Root route
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
