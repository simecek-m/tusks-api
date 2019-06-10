const taskSchema = {
  title: 'task schema v1',
  type: 'object',
  properties: {
    _id: {
      type: 'string'
    },
    text: {
      type: 'string'
    },
    completed: {
      type: 'boolean'
    }
  },
  required: ['_id', 'text', 'completed']
};

module.exports = taskSchema;
