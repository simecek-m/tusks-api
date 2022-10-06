import { IFilterXSSOptions } from "xss";

// logger
export const LOGGER_ID = "main";

// regex patterns
export const COLOR_HEX_FORMAT = /^#(?:[0-9a-fA-F]{3}){1,2}$/g;
export const DATABASE_UUID_FORMAT = /^[a-f\d]{24}$/i;

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

// type values
export const AVAILABLE_ROLES = ["owner", "admin", "user"] as const;
