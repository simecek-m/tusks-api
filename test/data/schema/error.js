const errorSchema = {
  title: 'task schema v1',
  type: 'object',
  properties: {
    message: {
      type: 'string'
    },
    name: {
      type: 'string'
    },
    stringValue: {
      type: 'string'
    },
    kind: {
      type: 'string'
    },
    value: {
      type: 'string'
    },
    path: {
      type: 'string'
    }
  },
  required: ['message', 'name', 'stringValue', 'kind', 'value', 'path']
};

module.exports = errorSchema;
