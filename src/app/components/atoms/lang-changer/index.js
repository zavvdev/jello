"use client";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { COOKIE_KEY, LOCALES } from "~/app/i18n/config";

export function LangChanger() {
  var { i18n } = useTranslation();

  var currentLocale = i18n.language;
  var router = useRouter();
  var currentPathname = usePathname();

  var handleChange = (e) => {
    var newLocale = e.target.value;

    var days = 30;
    var date = new Date();

    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${COOKIE_KEY}=${newLocale};expires=${date.toUTCString()};path=/`;

    router.push(currentPathname.replace(`/${currentLocale}`, `/${newLocale}`));
    router.refresh();
  };

  return (
    <select onChange={handleChange} value={currentLocale}>
      <option value={LOCALES.en}>English</option>
      <option value={LOCALES.pl}>Polish</option>
    </select>
  );
}
