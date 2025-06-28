const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
  const { fullName, username, password } = req.body;
  try {
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({ fullName, username, password: hashed });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '3d',
    });

    res.status(201).json({
      message: 'Registered successfully',
      token,
      username: newUser.username,
      fullName: newUser.fullName,
    });
  } catch (err) {
    console.error(err); // Log error for debugging
    res.status(500).json({ message: 'Error registering user' });
  }
};

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '3d',
    });

    res.json({
      token,
      username: user.username,
      fullName: user.fullName,
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed' });
  }
};

