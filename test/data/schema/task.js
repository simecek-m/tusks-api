const taskSchema = {
  title: "task schema v1",
  type: "object",
  properties: {
    _id: {
      type: "string",
    },
    text: {
      type: "string",
    },
    isCompleted: {
      type: "boolean",
    },
  },
  required: ["_id", "text", "isCompleted"],
};

module.exports = taskSchema;
