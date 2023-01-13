import { DEFAULT_XSS_OPTIONS, URL_ADDRESS_FORMAT } from "constant";
import xss from "xss";
import { object, string } from "yup";

const userSchema = object({
  username: string()
    .transform((data) => xss(data, DEFAULT_XSS_OPTIONS))
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
  profilePicure: string().matches(URL_ADDRESS_FORMAT).nullable(),
  email: string().email().required(),
});

export default userSchema;
