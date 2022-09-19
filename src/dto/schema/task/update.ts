import { boolean, object } from "yup";

const updateTaskSchema = object({
  isCompleted: boolean().required(),
});

export default updateTaskSchema;
