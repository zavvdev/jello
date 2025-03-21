import { DEFAULT_LOCALE } from "~/app/i18n/config";
import { API_ROUTES } from "~/app/api/config";

// Public routes

export var PUBLIC_ROUTES = {
  auth: {
    register: () => "/auth/register",
    login: () => "/auth/login",
    logout: () => "/auth/logout",
  },
};

// Private routes

var PRIVATE_ROUTE_PREFIX = "u";
var prvt = (route) => `/${PRIVATE_ROUTE_PREFIX}${route}`;

export var PRIVATE_ROUTES = {
  boards: () => prvt("/boards"),
};

// Logout

export var APP_LOGOUT_URL = {
  full: `${API_ROUTES.auth.logout.cookie()}?redirect_to=${makeFullAppUrl(PUBLIC_ROUTES.auth.login())}`,
  redirectUrl: makeFullAppUrl(PUBLIC_ROUTES.auth.login()),
  base: API_ROUTES.auth.logout.cookie(),
  queryName: "redirect_to",
};

// Utils

/**
 * @param {string} pathname
 * @param {string?} lang
 */
export function makeFullAppUrl(pathname, lang = DEFAULT_LOCALE) {
  return `${process.env.APP_URL}/${lang}${pathname}`;
}

/**
 * @param {string} pathname
 */
export function isPrivateRoute(pathname) {
  var paths = pathname.split("/").filter(Boolean);
  return (
    paths[0] === PRIVATE_ROUTE_PREFIX ||
    paths[1] === PRIVATE_ROUTE_PREFIX
  );
}
