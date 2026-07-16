const express = require('express');

const todoController = require('./controllers/todoController');

const app = express();

const PORT = 5000;

// Middleware to parse form data (URL-encoded bodies)
app.use(express.urlencoded({ extended: true }));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Routes mapped directly to Controller actions
app.get('/', todoController.getTodos);
app.post('/add', todoController.addTodo);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});