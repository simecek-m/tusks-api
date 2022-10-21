import { IProject } from "types";
import { AVAILABLE_ICONS, IconType } from "types/icon";
import { Schema, model, ObjectId } from "mongoose";
import { NORMALIZED_OUTPUT } from "database/utils";
import Tag from "database/model/Tag";
import Page from "database/model/Page";
import Task from "database/model/Task";
import Share from "database/model/Share";
import ThemedColor from "database/model/ThemedColor";
import ProjectSettings from "./ProjectSettings";

const ProjectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: [true, "Name field of Project is required!"],
    },
    icon: {
      type: String,
      required: [true, "Icon field of Project is required!"],
      validate: {
        validator: async (icon: IconType) => {
          return AVAILABLE_ICONS.includes(icon);
        },
        message: "Unsupported icon type!",
      },
    },
    author: {
      type: String,
      required: [true, "Author field of Project is required!"],
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
      required: [true, "Color of Project is required field!"],
    },
    pages: {
      type: [Page.schema],
    },
    share: {
      type: Share.schema,
      default: {
        users: [],
        team: null,
      },
    },
    settings: {
      type: ProjectSettings.schema,
      default: {
        visiblePages: true,
        visibleTasks: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

ProjectSchema.set("toJSON", NORMALIZED_OUTPUT);
ProjectSchema.set("toObject", NORMALIZED_OUTPUT);

export default model<IProject>("project", ProjectSchema);
