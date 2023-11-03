import { AVAILABLE_MEMEBR_ROLES } from "constant";
import { object, string } from "yup";

const memberRoleSchema = object({
  role: string()
    .oneOf([...AVAILABLE_MEMEBR_ROLES])
    .trim()
    .required(),
});

export default memberRoleSchema;
