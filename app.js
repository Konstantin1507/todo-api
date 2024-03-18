import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import morgan from 'morgan';
dotenv.config();

const port = process.env.PORT || 8080;

import authRoutes from './routes/auth.js';
import todoRoutes from './routes/todo.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));

app.use('/auth', authRoutes);
app.use('/todos', todoRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message || 'Something went wrong';
  res.status(status).json({ message: message });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then((result) => {
    app.listen(port);
  })
  .catch((err) => console.log(err));
