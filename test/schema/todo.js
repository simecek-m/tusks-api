const taskSchema = require('~schema/task');

const todoSchema = {
  title: 'todo schema v1',
  type: 'object',
  properties: {
    _id: {
      type: 'string',
    },
    title: {
      type: 'string'
    },
    tasks: {
      type: 'array',
      items: taskSchema
    }
  },
  required: ['_id', 'title', 'tasks']
};

module.exports = todoSchema;
