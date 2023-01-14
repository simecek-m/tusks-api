import taskSchema from "dto/schema/task";
import { model, Schema } from "mongoose";
import { IPageContent } from "types";

const PageContentSchema = new Schema<IPageContent>(
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

export default model<IPageContent>("pageContent", PageContentSchema);
