import { ObjectId, Schema, model } from "mongoose";
import { NORMALIZED_OUTPUT } from "database/utils";
import { IShare } from "types";
import Team from "database/model/Team";

const ShareSchema = new Schema<IShare>(
  {
    team: {
      type: Schema.Types.ObjectId,
      ref: "team",
      validate: {
        validator: async (teamId: ObjectId) => {
          const team = await Team.findById(teamId);
          return team !== null;
        },
        message: "Non-existent team!",
      },
    },
    users: {
      type: [String],
    },
  },
  {
    autoCreate: false,
    timestamps: true,
  }
);

ShareSchema.set("toJSON", NORMALIZED_OUTPUT);
ShareSchema.set("toObject", NORMALIZED_OUTPUT);

export default model<IShare>("share", ShareSchema);
