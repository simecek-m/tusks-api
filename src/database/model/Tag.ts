import { Schema, model } from "mongoose";
import Color from "database/model/Color";
import { NORMALIZED_OUTPUT } from "database/utils";
import { ITag } from "types";

const TagSchema = new Schema<ITag>({
  owner: {
    type: String,
    required: [true, "Owner of tag is required field!"],
  },
  label: {
    type: String,
    required: [true, "Tag's label is required field!"],
  },
  color: {
    type: Color.schema,
    required: [true, "Color of Tag is required field!"],
  },
});

TagSchema.set("toJSON", NORMALIZED_OUTPUT);
TagSchema.set("toObject", NORMALIZED_OUTPUT);

export default model<ITag>("tag", TagSchema);
