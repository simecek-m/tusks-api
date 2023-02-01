import {
  DEFAULT_XSS_OPTIONS,
  URL_ADDRESS_FORMAT,
  USERNAME_FORMAT,
} from "constant";
import xss from "xss";
import { object, string } from "yup";

const profileSchema = object({
  username: string()
    .transform((data) => xss(data, DEFAULT_XSS_OPTIONS))
    .trim()
    .matches(
      USERNAME_FORMAT,
      "Wrong format. Username has to looks like this: @username"
    )
    .required(),
  email: string()
    .transform((data) => xss(data, DEFAULT_XSS_OPTIONS))
    .email()
    .trim()
    .required(),
  firstName: string()
    .transform((data) => xss(data, DEFAULT_XSS_OPTIONS))
    .trim()
    .required(),
  lastName: string()
    .transform((data) => xss(data, DEFAULT_XSS_OPTIONS))
    .trim()
    .required(),
  picture: string()
    .matches(URL_ADDRESS_FORMAT, "Profile picture has to be valid URL address!")
    .trim()
    .required(),
});

export default profileSchema;
