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
}

export interface ITodoList {
  id: Types.ObjectId;
  author: string;
  title: string;
  icon: IconType;
  tasks: [ITask];
  tags: [Schema.Types.ObjectId];
  color: IThemedColor;
}
