const todoSchema = require('./todo');

const todosSchema = {
  title: 'todos schema v1',
  type: 'array',
  items: todoSchema
}

module.exports = todosSchema;