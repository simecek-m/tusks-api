const mongoose = require("mongoose");

const ThemedColorSchema = new mongoose.Schema(
  {
    light: {
      type: String,
      required: [true, "Light color variant is required"],
      match: [/^#(?:[0-9a-fA-F]{3}){1,2}$/g, "Color have to be in HEX format"],
    },
    dark: {
      type: String,
      required: [true, "Dark color variant is required"],
      match: [/^#(?:[0-9a-fA-F]{3}){1,2}$/g, "Color have to be in HEX format"],
    },
  },
  {
    _id: false,
    autoCreate: false,
  }
);

const ThemedColor = mongoose.model("themedColor", ThemedColorSchema);

module.exports = ThemedColor;
