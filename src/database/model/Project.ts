import Page from "database/model/Page";
import Share from "database/model/Share";
import Tag from "database/model/Tag";
import ThemedColor from "database/model/ThemedColor";
import { NORMALIZED_OUTPUT } from "database/utils";
import { model, ObjectId, Schema } from "mongoose";
import { IProject } from "types";
import { AVAILABLE_ICONS, IconType } from "types/icon";

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
    owner: {
      type: String,
      required: [true, "Owner field of Project is required!"],
    },
    description: {
      type: String,
    },
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
      required: [true, "Pages of Project is required field!"],
      default: [],
    },
    share: {
      type: Share.schema,
      required: [true, "Share of Project is required field!"],
      default: {
        users: [],
        team: null,
      },
    },
    defaultPage: {
      type: Page.schema,
    },
  },
  {
    timestamps: true,
  }
);

ProjectSchema.set("toJSON", NORMALIZED_OUTPUT);
ProjectSchema.set("toObject", NORMALIZED_OUTPUT);

export default model<IProject>("project", ProjectSchema);
