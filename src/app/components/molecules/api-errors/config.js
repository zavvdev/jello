export var UNAUTHORIZED_MSG = "NEXT_REDIRECT";

export var TRANSLATIONS = {
  en: {
    logout: "Logout",
  },
  pl: {
    logout: "Wyloguj się",
  },
};

export var FALLBACK_MESSAGES = {
  en: {
    [UNAUTHORIZED_MSG]:
      "Your session has been expired. Please login again.",
  },
  pl: {
    [UNAUTHORIZED_MSG]: "Twoja sesja wygasła. Zaloguj się ponownie.",
  },
};

export var FALLBACK_MESSAGES_KEYS = Object.keys(FALLBACK_MESSAGES.en);
