import { LOCALES } from "~/app/i18n/config";

/**
 * @param {string} pathname
 * @returns {string | undefined}
 */
export function getLangFromPathname(pathname) {
  var lang = pathname.split("/")[1];
  return Object.values(LOCALES).includes(lang) ? lang : undefined;
}
