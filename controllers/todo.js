import Todo from '../models/todo.js';

const createTodo = async (req, res) => {
  const { content, isCompleted } = req.body;
  const userId = req.userId;
  const todo = new Todo({ isCompleted, content, userId });

  const newTodo = await todo.save();
  res.status(201).json({
    message: 'Todo created successfully!',
    createdTodo: newTodo,
  });
};

const getTodos = async (req, res) => {
  const { status, page = 1, limit = 3 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const query = { userId: req.userId };
  if (status === 'completed' || status === 'incompleted') {
    query.isCompleted = status === 'completed';
  }

  const totalTodos = await Todo.countDocuments(query);
  const todos = await Todo.find(query).skip(skip).limit(parseInt(limit));
  res.status(200).json({
    totalTodos,
    totalPages: Math.ceil(totalTodos / parseInt(limit)),
    currentPage: parseInt(page),
    todos,
  });
};

const getTodo = async (req, res) => {
  const userId = req.userId;
  const todoId = req.params.todoId;
  const todo = await Todo.findById(todoId);

  if (!todo) {
    const error = new Error('Todo not found');
    error.statusCode = 404;
    throw error;
  }
  if (todo.userId !== userId) {
    const error = new Error('Not authorized!');
    error.statusCode = 404;
    throw error;
  }
  res.status(200).json({ message: 'Todo fetched.', todo });
};

const updateTodo = async (req, res) => {
  const userId = req.userId;
  const todoId = req.params.todoId;
  const { content, isCompleted } = req.body;

  const updatedTodo = await Todo.findById(todoId);
  if (!updatedTodo) {
    const error = new Error('Todo not found');
    error.statusCode = 404;
    throw error;
  }
  if (updatedTodo.userId !== userId) {
    const error = new Error('Not authorized!');
    error.statusCode = 404;
    throw error;
  }

  updatedTodo.content = content;
  updatedTodo.isCompleted = isCompleted;
  await updatedTodo.save();
  res.status(200).json({
    message: 'Todo updated successfully!',
    updatedTodo: updatedTodo,
  });
};

const deleteTodo = async (req, res) => {
  const userId = req.userId;
  const todoId = req.params.todoId;

  const deletedTodo = await Todo.findOneAndDelete({
    _id: todoId,
    userId: userId,
  });
  if (!deletedTodo) {
    const error = new Error('Todo not found');
    error.statusCode = 404;
    throw error;
  }
  res.status(200).json({ message: 'Todo deleted successfully' });
};

export { createTodo, getTodos, getTodo, updateTodo, deleteTodo };
