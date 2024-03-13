const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signup = async (req, res) => {
  const login = req.body.login;
  const password = req.body.password;
  try {
    const existingUser = await User.findOne({ login: login });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'User with this login already exists.' });
    }
    const newUser = new User({
      login: login,
      password: password,
    });
    await newUser.save();
    res.status(201).json({ message: 'User created!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const login = req.body.login;
  const password = req.body.password;
  try {
    const loggedUser = await User.findOne({ login: login, password: password });
    if (!loggedUser) {
      return res.status(401).json({ message: 'Invalid login or password' });
    }
    const token = jwt.sign(
      {
        userId: loggedUser._id.toString(),
      },
      process.env.SECRET
    );
    res.status(200).json({ token: token, message: 'User loggedin!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
