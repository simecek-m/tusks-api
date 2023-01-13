import { lazy, object, string } from "yup";
import taskSchema from "./task";

const markdowntasksSchema = object({
  tasks: lazy((value) =>
    object().shape(
      Object.entries(value).reduce((obj, [key]) => {
        obj[key] = taskSchema;
        return obj;
      }, {})
    )
  ),
  template: string().required(),
});

export default markdowntasksSchema;
