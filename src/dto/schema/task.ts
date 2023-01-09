import { DATE_FORMAT, DEFAULT_XSS_OPTIONS } from "constant";
import xss from "xss";
import { boolean, number, object, string } from "yup";

const taskSchema = object({
  text: string()
    .transform((data) => xss(data, DEFAULT_XSS_OPTIONS))
    .trim()
    .required(),
  isCompleted: boolean().required(),
  priority: number().min(0).max(5).required(),
  deadline: string().matches(DATE_FORMAT),
  reminder: string().matches(DATE_FORMAT),
});

export default taskSchema;
