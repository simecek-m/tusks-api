import { DEFAULT_XSS_OPTIONS } from "constant";
import { AVAILABLE_ICONS } from "types/icon";
import xss from "xss";
import { array, object, string } from "yup";
import colorSchema from "./color";
import mdtSchema from "./mdt";
import tagSchema from "./tag";

const pageSchema = object({
  name: string()
    .transform((data) => xss(data, DEFAULT_XSS_OPTIONS))
    .trim()
    .required(),
  icon: string()
    .oneOf([...AVAILABLE_ICONS])
    .trim()
    .required(),
  description: string()
    .transform((data) => xss(data, DEFAULT_XSS_OPTIONS))
    .trim(),
  tags: array().of(tagSchema),
  color: colorSchema.required(),
  content: mdtSchema.nullable(),
});

export default pageSchema;
