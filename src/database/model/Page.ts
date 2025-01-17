import { NORMALIZED_OUTPUT } from "database/utils";
import { model, Schema } from "mongoose";
import { IPage } from "types";
import { AVAILABLE_ICONS, IconType } from "types/icon";
import Color from "./Color";
import PageContent from "./PageContent";
import Tag from "./Tag";

const PageSchema = new Schema<IPage>(
  {
    name: {
      type: String,
      required: [true, "Name field of Page is required!"],
    },
    description: {
      type: String,
    },
    icon: {
      type: String,
      required: [true, "Icon field of Page is required!"],
      validate: {
        validator: async (icon: IconType) => {
          return AVAILABLE_ICONS.includes(icon);
        },
        message: "Unsupported icon type!",
      },
    },
    color: {
      type: Color.schema,
      required: [true, "Color field of Page is required!"],
    },
    tags: {
      type: [Schema.Types.ObjectId],
      ref: "tag",
      validate: {
        validator: async (tags: Array<Schema.Types.ObjectId>) => {
          const exitedTagsCount = await Tag.countDocuments({
            _id: { $in: tags },
          });
          return tags.length === exitedTagsCount;
        },
        message: "Non-existent tag!",
      },
    },
    content: {
      type: PageContent.schema,
    },
  },
  {
    autoCreate: false,
    timestamps: true,
  }
);

PageSchema.set("toJSON", NORMALIZED_OUTPUT);
PageSchema.set("toObject", NORMALIZED_OUTPUT);

export default model<IPage>("page", PageSchema);
