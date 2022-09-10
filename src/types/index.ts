import { Schema, Types } from "mongoose";

export interface Error {
  status?: number;
  message: string;
}

export interface IThemedColor {
  light: string;
  dark: string;
}

export interface ITag {
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
  author: string;
  title: string;
  icon: string;
  tasks: [ITask];
  tags: [Schema.Types.ObjectId];
}
