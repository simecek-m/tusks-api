import { AVAILABLE_ROLES } from "constant";
import { ObjectId, Types } from "mongoose";
import { IconType } from "types/icon";

export interface IFieldError {
  field: string;
  message: string;
}

export interface IThemedColor {
  light: string;
  dark: string;
}

export type Role = typeof AVAILABLE_ROLES[number];

export interface IMember {
  user: string;
  role: Role;
}

export interface ITeam {
  name: string;
  color: IThemedColor;
  icon: IconType;
  members: Array<IMember>;
}

export interface IShare {
  users: Array<string>;
  team?: ITeam;
}

export interface ITag {
  id: ObjectId;
  owner: string;
  label: string;
  color: IThemedColor;
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
  color: IThemedColor;
  content: string;
  tags: Array<ObjectId>;
}

export interface IProjectSettings {
  visibleTasks: boolean;
  visiblePages: boolean;
}

export interface IProject {
  id: Types.ObjectId;
  name: string;
  icon: IconType;
  description: string;
  author: string;
  color: IThemedColor;
  tags: Array<ObjectId>;
  tasks: Array<ITask>;
  pages: Array<IPage>;
  settings: IProjectSettings;
  share: IShare;
}
