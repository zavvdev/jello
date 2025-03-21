import { createInstance } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next/initReactI18next";
import { DEFAULT_LOCALE, LOCALES } from "~/app/i18n/config";

/**
 * @param {string} locale
 * @param {string[]} namespaces
 * @param {import("i18next").i18n} i18nInstance
 * @param {import("i18next").Resource} resources
 */
export async function initI18n(
  locale,
  namespaces,
  i18nInstance,
  resources,
) {
  i18nInstance = i18nInstance || createInstance();

  i18nInstance.use(initReactI18next);

  if (!resources) {
    i18nInstance.use(
      resourcesToBackend(
        (language, namespace) =>
          import(`./locales/${language}/${namespace}.json`),
      ),
    );
  }

  var locales = Object.values(LOCALES);

  await i18nInstance.init({
    lng: locale,
    resources,
    fallbackLng: DEFAULT_LOCALE,
    supportedLngs: locales,
    defaultNS: namespaces[0],
    fallbackNS: namespaces[0],
    ns: namespaces,
    preload: resources ? [] : locales,
  });

  return {
    i18n: i18nInstance,
    resources: {
      [locale]: i18nInstance.services.resourceStore.data[locale],
    },
    t: i18nInstance.t,
  };
}

/**
 * @param {Promise<{ locale: string }>} params
 */
export function getI18nFromParams(params) {
  return async (namespaces) => {
    var { locale } = await params;
    return await initI18n(locale, namespaces);
  };
}
