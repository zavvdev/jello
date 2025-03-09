export var apiRoute = (route) => `${process.env.APP_URL}${route}`;

export var API_ROUTES = {
  auth: {
    login: () => "/api/auth/login",
    register: () => "/api/auth/register",
  },

  boards: {
    getActive: () => `/api/boards/active`,
  },
};

export var PUBLIC_API_ROUTES = [
  API_ROUTES.auth.login(),
  API_ROUTES.auth.register(),
];

export var API_AUTH_HEADER = process.env.API_AUTH_HEADER;

export var API_MESSAGES = {
  success: "success",
  unexpectedError: "unexpected_error",
  unauthorized: "unauthorized",
};

export var SUCCESS_RESPONSE = ({ data, message, status }) => {
  return new Response(
    JSON.stringify({ data, message: message || API_MESSAGES.success }),
    {
      status: status || 200,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};

export var ERROR_RESPONSE = ({ data, message, status } = {}) => {
  return new Response(
    JSON.stringify({
      data: data || null,
      message: message || API_MESSAGES.unexpectedError,
    }),
    {
      status: status || 500,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};
