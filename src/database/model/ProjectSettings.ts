import { model, Schema } from "mongoose";
import { IProjectSettings } from "types";

const ProjectSettingsSchema = new Schema<IProjectSettings>(
  {
    visiblePages: {
      type: Boolean,
      required: [true, "Project settings field visiblePages is required!"],
    },
    visibleTasks: {
      type: Boolean,
      required: [true, "Project settings field visiblePages is required!"],
    },
  },
  {
    _id: false,
    autoCreate: false,
  }
);

export default model<IProjectSettings>(
  "projectSettings",
  ProjectSettingsSchema
);
