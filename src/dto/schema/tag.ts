import { COLOR_HEX_FORMAT, DEFAULT_XSS_OPTIONS } from "constant";
import xss from "xss";
import { object, string } from "yup";

const tagSchema = object({
  label: string()
    .transform((data) => xss(data, DEFAULT_XSS_OPTIONS))
    .trim()
    .required(),
  color: object({
    light: string()
      .matches(
        COLOR_HEX_FORMAT,
        "Light version of the color field must be in HEX format (#FFFFFF)"
      )
      .uppercase()
      .required("Light version of the color field is required!"),
    dark: string()
      .matches(
        COLOR_HEX_FORMAT,
        "Dark version of the color field must be in HEX format (#FFFFFF)"
      )
      .uppercase()
      .required("Dark version of the color field is required!"),
  }),
});

export default tagSchema;
