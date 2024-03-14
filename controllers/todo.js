import Todo from '../models/todo.js';

const createTodo = async (req, res) => {
  const { content, isCompleted } = req.body;
  const userId = req.userId;

  const todo = new Todo({ isCompleted, content, userId });
  try {
    const newTodo = await todo.save();
    res.status(201).json({
      message: 'Todo created successfully!',
      createdTodo: newTodo,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTodos = async (req, res) => {
  const { status, page = 1, limit = 3 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const query = { userId: req.userId };

  if (status === 'completed' || status === 'incompleted') {
    query.isCompleted = status === 'completed';
  }

  try {
    const totalTodos = await Todo.countDocuments(query);
    const todos = await Todo.find(query).skip(skip).limit(parseInt(limit));

    res.status(200).json({
      totalTodos,
      totalPages: Math.ceil(totalTodos / parseInt(limit)),
      currentPage: parseInt(page),
      todos,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTodo = async (req, res) => {
  const userId = req.userId;
  const todoId = req.params.todoId;
  const todo = await Todo.findById(todoId);
  try {
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    if (todo.userId !== userId) {
      return res.status(404).json({ message: 'Not authorized!' });
    }
    res.status(200).json({ message: 'Todo fetched.', todo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTodo = async (req, res) => {
  const userId = req.userId;
  const todoId = req.params.todoId;
  const { content, isCompleted } = req.body;

  try {
    const updatedTodo = await Todo.findById(todoId);
    if (!updatedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    if (updatedTodo.userId !== userId) {
      return res.status(404).json({ message: 'Not authorized!' });
    }
    updatedTodo.content = content;
    updatedTodo.isCompleted = isCompleted;

    await updatedTodo.save();
    res.status(200).json({
      message: 'Todo updated successfully!',
      updatedTodo: updatedTodo,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTodo = async (req, res) => {
  const userId = req.userId;
  const todoId = req.params.todoId;
  try {
    const deletedTodo = await Todo.findOneAndDelete({
      _id: todoId,
      userId: userId,
    });
    if (!deletedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
};

export { createTodo, getTodos, getTodo, updateTodo, deleteTodo };
