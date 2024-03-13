const express = require('express');

const todoController = require('../controllers/todo');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/todos', isAuth, todoController.getTodos);

router.get('/todos/completed', isAuth, todoController.getCompletedTodos);

router.get('/todos/incompleted', isAuth, todoController.getIncompletedTodos);

router.get('/todo/:todoId', isAuth, todoController.getTodo);

router.post('/todos', isAuth, todoController.createTodo);

router.put('/todo/:todoId', isAuth, todoController.updateTodo);

router.delete('/todo/:todoId', isAuth, todoController.deleteTodo);

module.exports = router;
