import { Schema, Types } from "mongoose";

export interface Error {
  status?: number;
  message: String;
}

export interface IThemedColor {
  light: String;
  dark: String;
}

export interface ITag {
  owner: String;
  label: String;
  color: IThemedColor;
}

export interface ITask {
  id: Types.ObjectId;
  text: String;
  isCompleted: boolean;
}

export interface ITodoList {
  author: String;
  title: String;
  icon: String;
  tasks: [ITask];
  tags: [Schema.Types.ObjectId];
}
