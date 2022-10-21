import ThemedColor from "database/model/ThemedColor";
import { NORMALIZED_OUTPUT } from "database/utils";
import { model, Schema } from "mongoose";
import { IMember, ITeam } from "types";
import { AVAILABLE_ICONS, IconType } from "types/icon";
import Member from "./Member";

const TeamSchema = new Schema<ITeam>({
  name: {
    type: String,
    required: [true, "Name field of Team is required!"],
  },
  icon: {
    type: String,
    default: "people-group",
    validate: {
      validator: async (icon: IconType) => {
        return AVAILABLE_ICONS.includes(icon);
      },
      message: "Unsupported icon type!",
    },
  },
  color: {
    type: ThemedColor.schema,
    required: [true, "Color of Team is required field!"],
  },
  members: {
    type: [Member.schema],
    required: [true, "Members of Team is required field!"],
    validate: {
      validator: (members: IMember[]) => members.length > 0,
      message: "Team must have at least one member!",
    },
  },
});

TeamSchema.set("toJSON", NORMALIZED_OUTPUT);
TeamSchema.set("toObject", NORMALIZED_OUTPUT);

export default model<ITeam>("team", TeamSchema);
