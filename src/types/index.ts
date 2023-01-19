import { AVAILABLE_MEMEBR_ROLES } from "constant";
import { ObjectId, Types } from "mongoose";
import { IconType } from "types/icon";

export interface IFieldError {
  field: string;
  message: string;
}

export interface IColor {
  light: string;
  dark: string;
}

export interface IPageContent {
  tasks: object;
  template: string;
}

export type Role = typeof AVAILABLE_MEMEBR_ROLES[number];

export interface IMember {
  user: string;
  role: Role;
}

export interface ITeam {
  name: string;
  color: IColor;
  icon: IconType;
  members: Array<IMember>;
  description?: string;
}

export interface IShare {
  users: Array<string>;
  team?: ITeam;
}

export interface ITag {
  id: ObjectId;
  owner: string;
  label: string;
  color: IColor;
}

export interface ITask {
  id: ObjectId;
  text: string;
  isCompleted: boolean;
  priority: number;
  deadline: Date;
  reminder: Date;
}

export interface IPage {
  id: Types.ObjectId;
  name: string;
  icon: IconType;
  color: IColor;
  content: IPageContent;
  tags: Array<ObjectId>;
}

export interface IProject {
  id: Types.ObjectId;
  name: string;
  icon: IconType;
  owner: string;
  description: string;
  tags: Array<ObjectId>;
  color: IColor;
  pages: Array<IPage>;
  share: IShare;
  defaultPageId?: Types.ObjectId;
}

export interface IProfile {
  _id: string;
  firstName: string;
  lastName: string;
  picture: string;
  email: string;
}

export type PAGE_TYPE = "tasklist" | "markdown";

export type HttpStatusName =
  | "OK"
  | "OK_NO_CONTENT"
  | "BAD_REQUEST"
  | "NOT_FOUND"
  | "CONFLICT"
  | "INTERNAL_SERVER_ERROR";

export type HttpStatusCode = 200 | 204 | 400 | 404 | 409 | 500;

export type HttpStatusType = Record<HttpStatusName, HttpStatusCode>;

export const HttpStatus: HttpStatusType = {
  OK: 200,
  OK_NO_CONTENT: 204,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};
