import { Schema, model, ObjectId } from "mongoose";
import { NORMALIZED_OUTPUT } from "database/utils";
import Tag from "database/model/tag";
import Task from "database/model/task";
import { ITodoList } from "types";

const ListSchema = new Schema<ITodoList>(
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
      type: [Schema.Types.ObjectId],
      ref: "tag",
      validate: {
        validator: async (tags: [ObjectId]) => {
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

export default model<ITodoList>("list", ListSchema);
