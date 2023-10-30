import { Schema, model } from "mongoose";
import { NORMALIZED_OUTPUT } from "database/utils";
import { ITask } from "types";

const TaskSchema = new Schema<ITask>(
  {
    text: {
      type: String,
      required: [true, "Text describing this Task is required!"],
    },
    isCompleted: {
      type: Boolean,
      default: false,
      required: [true, "State of task is required!"],
    },
    priority: {
      type: Number,
      min: [0, "Priority must be in 0 - 5 interval."],
      max: [5, "Priority must be in 0 - 5 interval."],
      default: 0,
    },
    deadline: {
      type: Date,
    },
    reminder: {
      type: Date,
    },
  },
  {
    autoCreate: false,
    timestamps: true,
  }
);

TaskSchema.set("toJSON", NORMALIZED_OUTPUT);
TaskSchema.set("toObject", NORMALIZED_OUTPUT);

export default model<ITask>("task", TaskSchema);
