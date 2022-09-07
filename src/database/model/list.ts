import mongoose from "mongoose";
import { NORMALIZED_OUTPUT } from "database/utils";
import Tag from "database/model/tag";
import Task from "database/model/task";

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
        validator: async (tags: [mongoose.Schema.Types.ObjectId]) => {
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

export default mongoose.model("list", ListSchema);
