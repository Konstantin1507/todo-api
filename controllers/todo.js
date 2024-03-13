const Todo = require('../models/todo');

exports.createTodo = async (req, res) => {
  const content = req.body.content;
  const isCompleted = req.body.isCompleted;
  const userId = req.userId;

  const todo = new Todo({
    isCompleted: isCompleted,
    content: content,
    userId: userId,
  });
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

exports.getTodos = async (req, res) => {
  const { page = 1, limit = 3 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  try {
    const totalTodos = await Todo.countDocuments({ userId: req.userId });
    const todos = await Todo.find({ userId: req.userId })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      totalTodos: totalTodos,
      totalPages: Math.ceil(totalTodos / parseInt(limit)),
      currentPage: parseInt(page),
      todos: todos,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCompletedTodos = async (req, res) => {
  const { page = 1, limit = 3 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  try {
    const totalCompletedTodos = await Todo.countDocuments({
      userId: req.userId,
      isCompleted: true,
    });
    const completedTodos = await Todo.find({
      userId: req.userId,
      isCompleted: true,
    })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      totalCompletedTodos: totalCompletedTodos,
      totalPages: Math.ceil(totalCompletedTodos / parseInt(limit)),
      currentPage: parseInt(page),
      completedTodos: completedTodos,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getIncompletedTodos = async (req, res) => {
  const { page = 1, limit = 3 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  try {
    const totalIncompletedTodos = await Todo.countDocuments({
      userId: req.userId,
      isCompleted: false,
    });
    const incompletedTodos = await Todo.find({
      userId: req.userId,
      isCompleted: false,
    })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      totalIncompletedTodos: totalIncompletedTodos,
      totalPages: Math.ceil(totalIncompletedTodos / parseInt(limit)),
      currentPage: parseInt(page),
      incompletedTodos: incompletedTodos,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTodo = async (req, res) => {
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
    res.status(200).json({ message: 'Todo fetched.', todo: todo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTodo = async (req, res) => {
  const userId = req.userId;
  const todoId = req.params.todoId;
  const content = req.body.content;
  const isCompleted = req.body.isCompleted;

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

exports.deleteTodo = async (req, res) => {
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
