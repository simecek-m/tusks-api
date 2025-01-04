import Color from "database/model/Color";
import { NORMALIZED_OUTPUT } from "database/utils";
import { model, Schema } from "mongoose";
import { IMember, ITeam } from "types";
import { AVAILABLE_ICONS, IconType } from "types/icon";
import Member from "./Member";
import Profile from "./Profile";

const TeamSchema = new Schema<ITeam>({
  name: {
    type: String,
    required: [true, "Name field of Team is required!"],
  },
  description: {
    type: String,
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
    type: Color.schema,
    required: [true, "Color of Team is required field!"],
  },
  members: [
    {
      type: Member.schema,
      required: [true, "Members of Team is required field!"],
      validate: {
        validator: async (members: IMember[]) => {
          const profiles = await Profile.find({
            _id: { $in: members.map((member) => member.user) },
          });
          return members.length === profiles.length;
        },
        message: "Team members could not be found!",
      },
    },
  ],
});

TeamSchema.set("toJSON", NORMALIZED_OUTPUT);
TeamSchema.set("toObject", NORMALIZED_OUTPUT);

export default model<ITeam>("team", TeamSchema);
