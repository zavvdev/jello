import { MESSAGES } from "jello-messages";
import queryString from "query-string";

var makeApiUrl = (route) => `${process.env.APP_URL}/api${route}`;

export var API_ROUTES = {
  me: {
    get: () => makeApiUrl("/me"),
    update: () => makeApiUrl("/me"),
    updatePassword: () => makeApiUrl("/me/password"),
    delete: () => makeApiUrl("/me"),
  },

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
    delete: (id) => makeApiUrl(`/boards/${id}`),
    create: () => makeApiUrl("/boards"),
    getOne: (id) => makeApiUrl(`/boards/${id}`),
    getUsers: (id) => makeApiUrl(`/boards/${id}/users`),
    update: (id) => makeApiUrl(`/boards/${id}`),
    archive: (id) => makeApiUrl(`/boards/${id}/archive`),
    activate: (id) => makeApiUrl(`/boards/${id}/activate`),
  },

  users: {
    search: (username) =>
      makeApiUrl(`/users/search?username=${username}`),
  },

  labels: {
    getAll: (boardId) => makeApiUrl(`/labels?board_id=${boardId}`),
  },

  lists: {
    getAll: (boardId) => makeApiUrl(`/lists?board_id=${boardId}`),
    create: () => makeApiUrl("/lists"),
    reorder: () => makeApiUrl("/lists/order"),
    update: (id) => makeApiUrl(`/lists/${id}`),
    delete: (id) => makeApiUrl(`/lists/${id}`),
  },

  tasks: {
    create: () => makeApiUrl("/tasks"),
    delete: (id) => makeApiUrl(`/tasks/${id}`),
    update: (id) => makeApiUrl(`/tasks/${id}`),
    get: (id) => makeApiUrl(`/tasks/${id}`),
    getComments: (id) => makeApiUrl(`/tasks/${id}/comments`),
    createComment: (id) => makeApiUrl(`/tasks/${id}/comments`),
    updateComment: (taskId, commentId) =>
      makeApiUrl(`/tasks/${taskId}/comments/${commentId}`),
    deleteComment: (taskId, commentId) =>
      makeApiUrl(`/tasks/${taskId}/comments/${commentId}`),
    getUsers: (taskId) => makeApiUrl(`/tasks/${taskId}/users`),
    assignUser: (taskId) => makeApiUrl(`/tasks/${taskId}/users`),
    removeUser: (taskId, userId) =>
      makeApiUrl(`/tasks/${taskId}/users/${userId}`),
    getLabels: (taskId) => makeApiUrl(`/tasks/${taskId}/labels`),
    assignLabel: (taskId) => makeApiUrl(`/tasks/${taskId}/labels`),
    removeLabel: (taskId, labelId) =>
      makeApiUrl(`/tasks/${taskId}/labels/${labelId}`),
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
  [MESSAGES.unauthorizedAction]: 403,
  [MESSAGES.listNotInBoard]: 400,
  [MESSAGES.listNotFound]: 400,
  [MESSAGES.alreadyAssigned]: 400,
  [MESSAGES.userNotFound]: 404,
  [MESSAGES.labelNotFound]: 404,
};
