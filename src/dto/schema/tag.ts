import { COLOR_HEX_FORMAT } from "constant";
import { object, string } from "yup";

const tagSchema = object({
  label: string().trim().required(),
  color: object({
    light: string()
      .matches(
        COLOR_HEX_FORMAT,
        "Light version of the color field must be in HEX format (#FFFFFF)"
      )
      .uppercase()
      .required(),
    dark: string()
      .matches(
        COLOR_HEX_FORMAT,
        "Dark version of the color field must be in HEX format (#FFFFFF)"
      )
      .uppercase()
      .required(),
  }).required(),
});

export default tagSchema;
