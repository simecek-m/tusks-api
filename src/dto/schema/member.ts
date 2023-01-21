import { AVAILABLE_MEMEBR_ROLES } from "constant";
import { boolean, object, string } from "yup";

const memberSchema = object({
  user: string().required(),
  role: string()
    .oneOf([...AVAILABLE_MEMEBR_ROLES])
    .required(),
  pending: boolean().required(),
});

export default memberSchema;
