import { DEFAULT_XSS_OPTIONS } from "constant";
import { AVAILABLE_ICONS } from "types/icon";
import xss from "xss";
import { array, object, string } from "yup";
import colorSchema from "./color";
import memberSchema from "./member";

const ALL_ICONS = [...AVAILABLE_ICONS];

const teamSchema = object({
  name: string()
    .transform((data) => xss(data, DEFAULT_XSS_OPTIONS))
    .trim()
    .required(),
  color: colorSchema,
  members: array().of(memberSchema).required(),
  icon: string().oneOf(ALL_ICONS).trim().required(),
});

export default teamSchema;
