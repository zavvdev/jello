import { DEFAULT_LOCALE } from "~/app/i18n/config";

var PRIVATE_ROUTE_PREFIX = "u";

var prvt = (route) => `/${PRIVATE_ROUTE_PREFIX}${route}`;

export var PUBLIC_ROUTES = {
  auth: {
    register: () => "/auth/register",
    login: () => "/auth/login",
  },
};

export var PRIVATE_ROUTES = {
  dashboard: () => prvt("/dashboard"),
};

/**
 * @param {string} pathname
 * @param {string?} lang
 */
export function appUrl(pathname, lang = DEFAULT_LOCALE) {
  return `${process.env.APP_URL}${lang ? `/${lang}` : ""}${pathname}`;
}

/**
 * @param {string} pathname
 */
export function isPrivateRoute(pathname) {
  var paths = pathname.split("/").filter(Boolean);
  return paths[0] === PRIVATE_ROUTE_PREFIX || paths[1] === PRIVATE_ROUTE_PREFIX;
}
