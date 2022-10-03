import { Schema, Types } from "mongoose";
import { IconType } from "./icon";

export interface IFieldError {
  field: string;
  message: string;
}

export interface IThemedColor {
  light: string;
  dark: string;
}

export interface ITag {
  id: Types.ObjectId;
  owner: string;
  label: string;
  color: IThemedColor;
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
  name: string;
  icon: IconType;
  color: IThemedColor;
  content: string;
  tags: [Schema.Types.ObjectId];
}

export interface INotebookSettings {
  visibleTasks: boolean;
  visiblePages: boolean;
}

export interface INotebook {
  id: Types.ObjectId;
  name: string;
  icon: IconType;
  description: string;
  author: string;
  color: IThemedColor;
  tags: [Schema.Types.ObjectId];
  tasks: [ITask];
  pages: [IPage];
  settings: INotebookSettings;
}
