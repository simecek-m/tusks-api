const taskSchema = require("~schema/task");

const listSchema = {
  title: "list schema v1",
  type: "object",
  properties: {
    _id: {
      type: "string",
    },
    title: {
      type: "string",
    },
    tasks: {
      type: "array",
      items: taskSchema,
    },
    author: {
      type: "string",
    },
  },
  required: ["_id", "title", "tasks"],
};

module.exports = listSchema;
