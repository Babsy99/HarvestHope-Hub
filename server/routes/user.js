const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router(); // Initialize the router

// Test route
router.get('/test', (req, res) => {
  res.send('Test route is working');
});

// Register route
router.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    console.log('Error during registration:', error);
    res.status(400).send({ error: 'Registration failed' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    console.log('Login request received:', req.body);
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      console.log('User not found');
      return res.status(400).send({ error: 'Invalid credentials' });
    }
    console.log('User found:', user);
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      console.log('Password does not match');
      return res.status(400).send({ error: 'Invalid credentials' });
    }
    console.log('User authenticated:', user);
    const token = jwt.sign({ _id: user._id }, 'secretkey', { expiresIn: '1h' });
    res.send({ user, token });
  } catch (error) {
    console.log('Error during login:', error);
    res.status(400).send({ error: 'An error occurred during login. Please try again.' });
  }
});

module.exports = router;
