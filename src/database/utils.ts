import { ToObjectOptions } from "mongoose";

export const NORMALIZED_OUTPUT: ToObjectOptions = {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    delete ret._id;
  },
};
