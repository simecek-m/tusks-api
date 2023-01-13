import { COLOR_HEX_FORMAT } from "constant";
import { object, string } from "yup";

const colorSchema = object({
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
});

export default colorSchema;
