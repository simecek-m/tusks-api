const listSchema = require('~schema/list');

const listsSchema = {
  title: 'todo lists schema v1',
  type: 'array',
  items: listSchema
};

module.exports = listsSchema;
