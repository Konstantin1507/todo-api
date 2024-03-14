import express from 'express';

import isAuth from '../middleware/is-auth.js';
import {
  createTodo,
  getTodos,
  getTodo,
  updateTodo,
  deleteTodo,
} from '../controllers/todo.js';

const router = express.Router();

router.get('/todos', isAuth, getTodos);

router.get('/todo/:todoId', isAuth, getTodo);

router.post('/todos', isAuth, createTodo);

router.put('/todo/:todoId', isAuth, updateTodo);

router.delete('/todo/:todoId', isAuth, deleteTodo);

export default router;
