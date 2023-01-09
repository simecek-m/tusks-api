import { array, object } from "yup";
import teamSchema from "./team";
import userSchema from "./user";

const shareSchema = object({
  users: array().of(userSchema).required(),
  team: teamSchema.nullable(),
});

export default shareSchema;
