import jwt from 'jsonwebtoken';

import User from '../models/user.js';

const signup = async (req, res) => {
  const { login, password } = req.body;
  const existingUser = await User.findOne({ login });
  if (existingUser) {
    const error = new Error('User with this login already exists.');
    error.statusCode = 401;
    throw error;
  }

  const newUser = new User({ login, password });
  await newUser.save();
  res.status(201).json({ message: 'User created!' });
};

const login = async (req, res) => {
  const { login, password } = req.body;
  const loggedUser = await User.findOne({ login, password });
  if (!loggedUser) {
    const error = new Error('Invalid login or password');
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
    {
      userId: loggedUser._id.toString(),
    },
    process.env.SECRET
  );

  res.status(200).json({ token, message: 'User loggedin!' });
};

export { signup, login };
