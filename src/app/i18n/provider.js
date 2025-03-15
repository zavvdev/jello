"use client";

import { I18nextProvider } from "react-i18next";
import { createInstance } from "i18next";
import { initI18n } from "~/app/i18n";

export function I18nProvider({ children, locale, namespaces, resources }) {
  var i18n = createInstance();
  initI18n(locale, namespaces, i18n, resources);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
