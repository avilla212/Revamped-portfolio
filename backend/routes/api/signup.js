const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const User = require('../../models/user');

// POST /api/signup
router.post('/', async (req, res) => {
  const { username, password } = req.body;

  try {
    // ✅ Input validation
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/; // Allow letters, numbers, underscore
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!usernameRegex.test(username)) {
      return res.status(400).json({ message: 'Username must be 3–20 characters with only letters, numbers, and underscores' });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          'Password must be at least 8 characters and include one uppercase letter, one lowercase letter, one number, and one special character'
      });
    }

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // ✅ Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // ✅ Create new user
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    // ✅ Set session
    req.session.userId = newUser._id;

    console.log(`✅ New user created: ${username}`);
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Signup error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
