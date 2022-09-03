const mongoose = require("mongoose");
const ThemedColor = require("./themedColor");
const { NORMALIZED_OUTPUT } = require("../utils");

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

const Tag = mongoose.model("tag", TagSchema);

module.exports = Tag;
