import jwt from 'jsonwebtoken';

import User from '../models/user.js';

const signup = async (req, res) => {
  const { login, password } = req.body;

  try {
    const existingUser = await User.findOne({ login });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'User with this login already exists.' });
    }
    const newUser = new User({ login, password });
    await newUser.save();
    res.status(201).json({ message: 'User created!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  const { login, password } = req.body;

  try {
    const loggedUser = await User.findOne({ login, password });
    if (!loggedUser) {
      return res.status(401).json({ message: 'Invalid login or password' });
    }
    const token = jwt.sign(
      {
        userId: loggedUser._id.toString(),
      },
      process.env.SECRET
    );
    res.status(200).json({ token, message: 'User loggedin!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { signup, login };
