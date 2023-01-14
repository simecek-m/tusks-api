import { lazy, object, string } from "yup";
import taskSchema from "./task";

const mdtSchema = object({
  tasks: lazy((value) =>
    object()
      .shape(
        Object.entries(value).reduce((obj, [key]) => {
          obj[key] = taskSchema;
          return obj;
        }, {})
      )
      .nullable()
  ),
  template: string(),
});

export default mdtSchema;
