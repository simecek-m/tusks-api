import { array, object, string } from "yup";
import teamSchema from "./team";

const shareSchema = object({
  users: array().of(string()).required(),
  team: teamSchema.nullable(),
});

export default shareSchema;
