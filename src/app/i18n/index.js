import { createInstance } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next/initReactI18next";
import { DEFAULT_LOCALE, LOCALES } from "~/app/i18n/config";

/**
 * @param {string} lng
 * @param {string} ns
 */
async function initI18next(lng, ns) {
  var i18nInstance = createInstance();

  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language, namespace) =>
          import(`./locales/${language}/${namespace}.json`),
      ),
    )
    .init({
      supportedLngs: Object.values(LOCALES),
      fallbackLng: DEFAULT_LOCALE,
      lng,
      ns,
    });

  return i18nInstance;
}

/**
 * @param {string} lng
 * @param {string | string[]} ns
 * @param {{ keyPrefix?: string }?} options
 */
export async function getI18n(lng, ns, options = {}) {
  var i18nextInstance = await initI18next(lng, ns);
  return {
    t: i18nextInstance.getFixedT(
      lng,
      Array.isArray(ns) ? ns[0] : ns,
      options.keyPrefix,
    ),
    i18n: i18nextInstance,
  };
}

/**
 * @param {Promise<{ lng: string }>} params
 */
export function getI18nFromParams(params) {
  return async (ns, options = {}) => {
    var { lng } = await params;
    return await getI18n(lng, ns, options);
  };
}
