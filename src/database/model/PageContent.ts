import taskSchema from "dto/schema/task";
import { model, Schema } from "mongoose";
import { IMdt } from "types";

const PageContentSchema = new Schema<IMdt>(
  {
    tasks: {
      type: Map,
      of: taskSchema,
    },
    template: {
      type: String,
    },
  },
  {
    _id: false,
    autoCreate: false,
  }
);

export default model<IMdt>("pageContent", PageContentSchema);
