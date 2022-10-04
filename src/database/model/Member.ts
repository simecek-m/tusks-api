import { AVAILABLE_ROLES } from "constant";
import { model, Schema } from "mongoose";
import { IMember, Role } from "types";

const MemberSchema = new Schema<IMember>(
  {
    user: {
      type: String,
      required: [true, "User reference field of Member is required."],
    },
    role: {
      type: String,
      required: [true, "Role field of Member is required."],
      validate: {
        validator: async (role: Role) => AVAILABLE_ROLES.includes(role),
        message: `Unknown role. Available values: ${AVAILABLE_ROLES}`,
      },
    },
  },
  {
    _id: false,
    autoCreate: false,
  }
);

export default model<IMember>("member", MemberSchema);
