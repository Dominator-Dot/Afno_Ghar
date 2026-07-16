// A mock database array
const todos = [
    { id: 1, task: "Learn Node.js MVC" },
    { id: 2, task: "Build an Express app" }
];

// Functions to interact with the data
const TodoModel = {
    getAll: () => {
        return todos;
    },
    add: (task) => {
        const newTodo = { id: todos.length + 1, task };
        todos.push(newTodo);
        return newTodo;
    }
};

module.exports = TodoModel;