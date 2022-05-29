const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, "Text describing this Task is required!"],
  },
  completed: {
    type: Boolean,
    default: false,
    required: [true, "State of task is required!"],
  },
});

const Task = mongoose.model("task", TaskSchema);

module.exports = Task;
