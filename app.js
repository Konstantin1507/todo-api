const express = require('express');
cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const morgan = require('morgan');
dotenv.config();

const port = process.env.PORT || 8080;

const todoRoutes = require('./routes/todo');
const authRoutes = require('./routes/auth');

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));

app.use('/todos', todoRoutes);
app.use('/auth', authRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then((result) => {
    app.listen(port);
  })
  .catch((err) => console.log(err));
