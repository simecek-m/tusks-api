const mongoose = require("mongoose");
const { NORMALIZED_OUTPUT } = require("../utils");

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

TaskSchema.set("toJSON", NORMALIZED_OUTPUT);
TaskSchema.set("toObject", NORMALIZED_OUTPUT);

const Task = mongoose.model("task", TaskSchema);

module.exports = Task;
