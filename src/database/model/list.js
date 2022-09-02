const mongoose = require("mongoose");
const Task = require("~model/task");
const { NORMALIZED_OUTPUT } = require("../utils");

const ListSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title field of todo list is required!"],
    },
    tasks: [Task.schema],
    author: {
      type: String,
      required: [true, "Author field of todo list is required!"],
    },
    icon: {
      type: String,
      required: [true, "Icon field of todo list is required!"],
    },
  },
  {
    timestamps: true,
  }
);

ListSchema.set("toJSON", NORMALIZED_OUTPUT);
ListSchema.set("toObject", NORMALIZED_OUTPUT);

const List = mongoose.model("list", ListSchema);

module.exports = List;
