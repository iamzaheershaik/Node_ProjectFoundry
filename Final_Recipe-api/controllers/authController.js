const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function register(req, res) {
  try {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    const existingUser = await User.findOne({ email: email });
    if (existingUser != null) {
      res.status(400).json({ message: 'Email already registered.' });
      return;
    }

    const newUser = new User({
      username: username,
      email: email,
      password: password
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Registration successful!',
      token: token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error on server" });
  }
}

async function login(req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({ email: email });
    if (user == null) {
      res.status(401).json({ message: 'Invalid email or password.' });
      return;
    }

    const isMatch = await user.matchPassword(password);
    if (isMatch == false) {
      res.status(401).json({ message: 'Invalid email or password.' });
      return;
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful!',
      token: token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error on server" });
  }
}

function logout(req, res) {
  res.status(200).json({ message: 'Logged out successfully.' });
}

module.exports = {
  register: register,
  login: login,
  logout: logout
};
