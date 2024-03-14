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

mongoose
  .connect(process.env.MONGO_URI)
  .then((result) => {
    app.listen(port);
  })
  .catch((err) => console.log(err));
