import { DATABASE_UUID_FORMAT, DEFAULT_XSS_OPTIONS } from "constant";
import xss from "xss";
import { array, object, string } from "yup";

const newListSchema = object({
  title: string()
    .transform((data) => xss(data, DEFAULT_XSS_OPTIONS))
    .trim()
    .required(),
  icon: string()
    .transform((data) => xss(data, DEFAULT_XSS_OPTIONS))
    .trim()
    .required(),
  tags: array().of(
    string().matches(
      DATABASE_UUID_FORMAT,
      "Wrong format of TAG UUID (631b7ac1e742114ef899326e)"
    )
  ),
});

export default newListSchema;
