const mongoose = require("mongoose");
const Task = require("~model/task");
const { NORMALIZED_OUTPUT } = require("../utils");
const Tag = require("./tag");

const ListSchema = new mongoose.Schema(
  {
    author: {
      type: String,
      required: [true, "Author field of todo list is required!"],
    },
    title: {
      type: String,
      required: [true, "Title field of todo list is required!"],
    },
    icon: {
      type: String,
      required: [true, "Icon field of todo list is required!"],
    },
    tasks: [Task.schema],
    tags: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "tag",
      validate: {
        validator: async (tags) => {
          const exitedTagsCount = await Tag.countDocuments({
            _id: { $in: tags },
          });
          return tags.length === exitedTagsCount;
        },
        message: "Non-existent tag!",
      },
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
