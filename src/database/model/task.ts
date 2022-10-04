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
  },
  {
    autoCreate: false,
    timestamps: true,
  }
);

TaskSchema.set("toJSON", NORMALIZED_OUTPUT);
TaskSchema.set("toObject", NORMALIZED_OUTPUT);

export default model<ITask>("task", TaskSchema);
