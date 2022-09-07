import mongoose from "mongoose";
import ThemedColor from "database/model/themedColor";
import { NORMALIZED_OUTPUT } from "database/utils";

const TagSchema = new mongoose.Schema({
  owner: {
    type: String,
    required: [true, "Owner of tag is required field!"],
  },
  label: {
    type: String,
    unique: true,
    required: [true, "Tag's label is required field!"],
  },
  color: {
    type: ThemedColor.schema,
    required: [true, "Color of Tag is required field!"],
  },
});

TagSchema.set("toJSON", NORMALIZED_OUTPUT);
TagSchema.set("toObject", NORMALIZED_OUTPUT);

export default mongoose.model("tag", TagSchema);
