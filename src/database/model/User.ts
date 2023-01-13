import { NORMALIZED_OUTPUT } from "database/utils";
import { model, Schema } from "mongoose";
import { IUser } from "types";

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, "Username field of Page is required!"],
    },
    firstName: {
      type: String,
      required: [true, "First name field of Page is required!"],
    },
    lastName: {
      type: String,
      required: [true, "Last name field of Page is required!"],
    },
    email: {
      type: String,
      required: [true, "E-mail field of Page is required!"],
    },
    profilePicture: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.set("toJSON", NORMALIZED_OUTPUT);
UserSchema.set("toObject", NORMALIZED_OUTPUT);

export default model<IUser>("user", UserSchema);
