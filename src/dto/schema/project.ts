import { DATABASE_UUID_FORMAT, DEFAULT_XSS_OPTIONS } from "constant";
import { AVAILABLE_ICONS } from "types/icon";
import xss from "xss";
import { array, object, string } from "yup";
import colorSchema from "./color";
import pageSchema from "./page";

const projectSchema = object({
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
    .trim()
    .nullable(),
  tags: array().of(string()).required(),
  color: colorSchema.required(),
  pages: array().of(pageSchema).required(),
  defaultPageId: string()
    .matches(
      DATABASE_UUID_FORMAT,
      "defaultPageId must be in correct ObjectID format (12-byte reference)"
    )
    .nullable(),
  share: string()
    .matches(
      DATABASE_UUID_FORMAT,
      "share must be in correct ObjectID format (12-byte reference)"
    )
    .nullable(),
});

export default projectSchema;
