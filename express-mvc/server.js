const express = require('express');

const todoController = require('./controllers/todoController');

const app = express();
<<<<<<< HEAD

=======
>>>>>>> 4d8c98789ee30d97ee53780e4b32bce4522d5445
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