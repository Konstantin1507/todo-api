import express from 'express';

import isAuth from '../middleware/is-auth.js';
import errorHandler from '../middleware/errorHandler.js';
import {
  createTodo,
  getTodos,
  getTodo,
  updateTodo,
  deleteTodo,
} from '../controllers/todo.js';

const router = express.Router();

router.get('/todos', isAuth, errorHandler(getTodos));

router.get('/todo/:todoId', isAuth, errorHandler(getTodo));

router.post('/todos', isAuth, errorHandler(createTodo));

router.put('/todo/:todoId', isAuth, errorHandler(updateTodo));

router.delete('/todo/:todoId', isAuth, errorHandler(deleteTodo));

export default router;
