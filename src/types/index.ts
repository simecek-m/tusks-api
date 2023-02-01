import { AVAILABLE_MEMEBR_ROLES } from "constant";
import { Types } from "mongoose";
import { IconType } from "types/icon";

export interface IFieldError {
  field: string;
  message: string;
}

export interface IColor {
  light: string;
  dark: string;
}

export interface IMdt {
  tasks: object;
  template: string;
}

export type Role = typeof AVAILABLE_MEMEBR_ROLES[number];

export interface IMember {
  user: string;
  role: Role;
  pending: boolean;
}

export interface ITeam {
  name: string;
  color: IColor;
  icon: IconType;
  members: Array<IMember>;
  description?: string;
}

export interface ITag {
  id: Types.ObjectId;
  owner: string;
  label: string;
  color: IColor;
}

export interface ITask {
  id: Types.ObjectId;
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
  content: IMdt;
  tags: Array<Types.ObjectId>;
}

export interface IProject {
  id: Types.ObjectId;
  name: string;
  icon: IconType;
  owner: string;
  description: string;
  tags: Array<Types.ObjectId>;
  color: IColor;
  pages: Array<IPage>;
  share: Types.ObjectId;
  defaultPageId?: Types.ObjectId;
}

export interface IProfile {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  picture: string;
  email: string;
}

export type HttpStatusName =
  | "OK"
  | "OK_NO_CONTENT"
  | "BAD_REQUEST"
  | "NOT_FOUND"
  | "CONFLICT"
  | "INTERNAL_SERVER_ERROR";

export type HttpStatusCode = 200 | 204 | 400 | 404 | 409 | 500;
