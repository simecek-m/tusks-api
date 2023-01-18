import { NORMALIZED_OUTPUT } from "database/utils";
import { model, Schema } from "mongoose";
import { IProfile } from "types";

const ProfileSchema = new Schema<IProfile>(
  {
    _id: {
      type: String,
      required: [true, "ID field of Profile is required!"],
    },
    firstName: {
      type: String,
      required: [true, "First name field of Profile is required!"],
    },
    lastName: {
      type: String,
      required: [true, "Last name field of Profile is required!"],
    },
    email: {
      type: String,
      required: [true, "E-mail field of Profile is required!"],
    },
    profilePicture: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

ProfileSchema.set("toJSON", NORMALIZED_OUTPUT);
ProfileSchema.set("toObject", NORMALIZED_OUTPUT);

export default model<IProfile>("profile", ProfileSchema);
