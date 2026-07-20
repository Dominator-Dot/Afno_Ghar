const TodoModel = require('../models/models/todomodel');

// Controller action to display todos
const getTodos = (req, res) => {
    const todos = TodoModel.getAll();
    // Renders the 'todoView.ejs' file and passes the todos data to it
    res.render('todoView', { todos });
};

// Controller action to handle adding a new todo
const addTodo = (req, res) => {
    const { task } = req.body;
    if (task) {
        TodoModel.add(task);
    }
    res.redirect('/'); // Refresh the page to show the new item
};

module.exports = {
    getTodos,
    addTodo
};