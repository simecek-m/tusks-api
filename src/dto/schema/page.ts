import { DEFAULT_XSS_OPTIONS } from "constant";
import { AVAILABLE_ICONS } from "types/icon";
import xss from "xss";
import { array, object, string, mixed } from "yup";
import tagSchema from "./tag";
import taskSchema from "./task";

const basePageSchema = object({
  name: string()
    .transform((data) => xss(data, DEFAULT_XSS_OPTIONS))
    .trim()
    .required(),
  icon: string()
    .oneOf([...AVAILABLE_ICONS])
    .trim()
    .required(),
  description: string()
    .transform((data) => xss(data, DEFAULT_XSS_OPTIONS))
    .trim(),
  tags: array().of(tagSchema),
});

const listPageSchema = basePageSchema.shape({
  tasks: array().of(taskSchema),
});

// TODO: validate markdown format of content
const markdownPageSchema = basePageSchema.shape({
  content: string().required(),
});

const pageSchema = mixed().oneOf([listPageSchema, markdownPageSchema]);

export default pageSchema;
