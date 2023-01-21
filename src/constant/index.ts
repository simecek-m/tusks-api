import { HttpStatusCode, HttpStatusName } from "types";
import { IFilterXSSOptions } from "xss";

// logger
export const LOGGER_ID = "main";

// regex patterns
export const COLOR_HEX_FORMAT = /^#(?:[0-9a-fA-F]{3}){1,2}$/g;
export const DATABASE_UUID_FORMAT = /^[0-9a-fA-F]{24}$/;
export const DATE_FORMAT = /^\d{4}(-\d{2}){2}(T)(\d{2}:){2}\d{2}\.\d{3}Z/g;
export const URL_ADDRESS_FORMAT =
  /^(http(s):\/\/.)[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/gi;

// database
export const DEFAULT_DB_TIMEOUT = 3000;

// xss
export const DEFAULT_XSS_OPTIONS: IFilterXSSOptions = {
  whiteList: {},
  stripIgnoreTag: true,
  stripBlankChar: true,
};

// ROUTES
export const ROUTE_STATS = "stats";
export const ROUTE_TAGS = "tags";
export const ROUTE_PROJECTS = "projects";
export const ROUTE_TASKS = "tasks";
export const ROUTE_TEAMS = "teams";
export const ROUTE_PAGES = "pages";
export const ROUTE_PROFILES = "profiles";

// type values
export const AVAILABLE_MEMEBR_ROLES = [
  "owner",
  "admin",
  "editor",
  "viewer",
] as const;

export const HttpStatus: Record<HttpStatusName, HttpStatusCode> = {
  OK: 200,
  OK_NO_CONTENT: 204,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};
