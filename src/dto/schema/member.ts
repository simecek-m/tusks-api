import { AVAILABLE_MEMEBR_ROLES } from "constant";
import { object, string } from "yup";
import userSchema from "./user";

const memberSchema = object({
  user: userSchema.required(),
  role: string()
    .oneOf([...AVAILABLE_MEMEBR_ROLES])
    .required(),
});

export default memberSchema;
