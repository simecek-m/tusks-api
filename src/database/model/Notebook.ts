import { Schema, model, ObjectId } from "mongoose";
import { NORMALIZED_OUTPUT } from "database/utils";
import Tag from "database/model/Tag";
import Page from "database/model/Page";
import Task from "database/model/Task";
import { INotebook } from "types";
import { AVAILABLE_ICONS } from "types/icon";
import ThemedColor from "database/model/ThemedColor";

const NotebookSchema = new Schema<INotebook>(
  {
    name: {
      type: String,
      required: [true, "Name field of Notebook is required!"],
    },
    icon: {
      type: String,
      required: [true, "Icon field of Notebook is required!"],
      validate: {
        validator: async (icon: string) => {
          return AVAILABLE_ICONS.includes(icon);
        },
        message: "Unsupported icon type!",
      },
    },
    author: {
      type: String,
      required: [true, "Author field of Notebook is required!"],
    },
    description: {
      type: String,
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
    color: {
      type: ThemedColor.schema,
      required: [true, "Color of Notebook is required field!"],
    },
    pages: {
      type: [Page.schema],
    },
  },
  {
    timestamps: true,
  }
);

NotebookSchema.set("toJSON", NORMALIZED_OUTPUT);
NotebookSchema.set("toObject", NORMALIZED_OUTPUT);

export default model<INotebook>("notebook", NotebookSchema);
