import { model, Schema } from "mongoose";
import { IShare } from "types";

const ShareSchema = new Schema<IShare>(
  {
    users: {
      type: [String],
    },
    team: {
      type: Schema.Types.ObjectId,
      ref: "team",
    },
  },
  {
    _id: false,
    autoCreate: false,
  }
);

export default model<IShare>("share", ShareSchema);
