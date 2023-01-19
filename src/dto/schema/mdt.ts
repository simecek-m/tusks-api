import { IMdt } from "types";
import { lazy, object, SchemaOf, string } from "yup";
import taskSchema from "./task";

const mdtSchema: SchemaOf<IMdt> = object({
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
