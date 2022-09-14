import { DATABASE_UUID_FORMAT, DEFAULT_XSS_OPTIONS } from "constant";
import { AVAILABLE_ICONS, IconType } from "types/icon";
import xss from "xss";
import { array, mixed, object, string } from "yup";

const udateListSchema = object({
  title: string()
    .transform((data) => xss(data, DEFAULT_XSS_OPTIONS))
    .trim(),
  icon: mixed<IconType>().oneOf(AVAILABLE_ICONS, "Unsupported icon type!"),
  tags: array().of(
    string().matches(
      DATABASE_UUID_FORMAT,
      "Wrong format of TAG UUID (631b7ac1e742114ef899326e)"
    )
  ),
});

export default udateListSchema;
