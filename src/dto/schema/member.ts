import { AVAILABLE_MEMEBR_ROLES } from "constant";
import { object, string } from "yup";

const memberSchema = object({
  user: string().required(),
  role: string()
    .oneOf([...AVAILABLE_MEMEBR_ROLES])
    .required(),
});

export default memberSchema;
