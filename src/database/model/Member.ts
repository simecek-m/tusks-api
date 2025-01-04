import { AVAILABLE_MEMEBR_ROLES } from "constant";
import Profile from "database/model/Profile";
import { model, Schema } from "mongoose";
import { IMember, Role } from "types";

const MemberSchema = new Schema<IMember>(
  {
    user: {
      type: String,
      ref: Profile,
      required: [true, "User reference field of Member is required."],
    },
    role: {
      type: String,
      required: [true, "Role field of Member is required."],
      validate: {
        validator: async (role: Role) => AVAILABLE_MEMEBR_ROLES.includes(role),
        message: `Unknown role. Available values: ${AVAILABLE_MEMEBR_ROLES}`,
      },
    },
    pending: {
      type: Boolean,
      required: [true, "Pending field of Member is required."],
    },
  },
  {
    _id: false,
    autoCreate: false,
  }
);

export default model<IMember>("member", MemberSchema);
