// API ROUTES

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
    getActive: () => makeApiUrl("/boards/active"),
  },
};

// API MESSAGES

export var API_MESSAGES = {
  ok: "ok",
  unexpectedError: "unexpected_error",
  unauthorized: "unauthorized",
  validationError: "validation_error",
  usernameExists: "username_exists",
  emailExists: "email_exists",
  invalid_credentials: "invalid_credentials",
  not_found: "not_found",
};

export var API_VALIDATION_MESSAGES = {
  required: "required",
  invalid: "invalid",
  lengthInsufficient: "length_insufficient",
  lengthExceeded: "length_exceeded",
  typeString: "type_string",
};

// API RESPONSES

export var SUCCESS_RESPONSE = ({ data, message, status } = {}) => {
  return new Response(
    JSON.stringify({
      success: true,
      data: data || null,
      message: message || API_MESSAGES.ok,
    }),
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
      success: false,
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
