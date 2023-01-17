import { COLOR_HEX_FORMAT } from "constant";
import { Schema, model } from "mongoose";
import { IColor } from "types";

const ColorSchema = new Schema<IColor>(
  {
    light: {
      type: String,
      required: [true, "Light color variant is required"],
      match: [
        COLOR_HEX_FORMAT,
        "Light version of the color field must be in HEX format (#FFFFFF)",
      ],
    },
    dark: {
      type: String,
      required: [true, "Dark color variant is required"],
      match: [
        COLOR_HEX_FORMAT,
        "Dark version of the color field must be in HEX format (#FFFFFF)",
      ],
    },
  },
  {
    _id: false,
    autoCreate: false,
  }
);

export default model<IColor>("color", ColorSchema);
