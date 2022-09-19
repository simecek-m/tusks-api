import { DEFAULT_XSS_OPTIONS } from "constant";
import xss from "xss";
import { object, string } from "yup";

const newTaskSchema = object({
  text: string()
    .transform((data) => xss(data, DEFAULT_XSS_OPTIONS))
    .trim()
    .required(),
});

export default newTaskSchema;
