import { MESSAGES } from "jello-messages";
import queryString from "query-string";

var makeApiUrl = (route) => `${process.env.APP_URL}/api${route}`;

export var API_ROUTES = {
  auth: {
    login: () => makeApiUrl("/auth/login"),
    register: () => makeApiUrl("/auth/register"),
    logout: {
      root: () => makeApiUrl("/auth/logout"),
      cookie: () => makeApiUrl("/auth/logout/cookie"),
    },
  },

  boards: {
    getAll: (searchParams) =>
      makeApiUrl(
        `/boards${searchParams ? `?${queryString.stringify(searchParams)}` : ""}`,
      ),
    getStarred: () => makeApiUrl("/boards/starred"),
    star: () => makeApiUrl("/boards/star"),
    unstar: (id) => makeApiUrl(`/boards/star/${id}`),
  },
};

/**
 * @param {{
 *  status: number;
 *  message: string;
 *  data: any;
 * }} options
 */
export var SUCCESS_RESPONSE = (options = {}) =>
  new Response(
    JSON.stringify({
      success: true,
      message: options.message || MESSAGES.ok,
      data: options.data || null,
    }),
    {
      status: options.status || 200,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

/**
 * @param {{
 *  status: number;
 *  message: string;
 *  data: any;
 * }} options
 */
export var ERROR_RESPONSE = (options = {}) =>
  new Response(
    JSON.stringify({
      success: false,
      message: options.message || MESSAGES.unexpectedError,
      data: options.data || null,
    }),
    {
      status: options.status || 500,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

export var MESSAGE_STATUS_MAP = {
  [MESSAGES.ok]: 200,
  [MESSAGES.unauthorized]: 401,
  [MESSAGES.validationError]: 400,
  [MESSAGES.usernameExists]: 409,
  [MESSAGES.emailExists]: 409,
  [MESSAGES.invalidCredentials]: 400,
  [MESSAGES.notFound]: 404,
  [MESSAGES.boardNotFound]: 404,
  [MESSAGES.alreadNotStarred]: 400,
  [MESSAGES.alreadyStarred]: 400,
};
