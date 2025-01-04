import { DEFAULT_XSS_OPTIONS } from "constant";
import { AVAILABLE_ICONS } from "types/icon";
import xss from "xss";
import { object, string } from "yup";
import colorSchema from "./color";

const teamSchema = object({
  name: string()
    .transform((data) => xss(data, DEFAULT_XSS_OPTIONS))
    .trim()
    .required(),
  color: colorSchema,
  icon: string()
    .oneOf([...AVAILABLE_ICONS])
    .trim()
    .required(),
  description: string(),
});

export default teamSchema;
