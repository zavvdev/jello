import { DEFAULT_LOCALE } from "~/app/i18n/config";

export var PUBLIC_ROUTES = {
  auth: {
    register: () => "/auth/register",
    login: () => "/auth/login",
  },
};

/**
 * @param {string} pathname
 * @param {string?} lang
 */
export function appUrl(pathname, lang = DEFAULT_LOCALE) {
  return `${process.env.APP_URL}${lang ? `/${lang}` : ""}${pathname}`;
}
