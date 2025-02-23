"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getI18n } from "~/app/i18n/index";

export function useI18n(ns, options = {}) {
  var { lng } = useParams();
  var { 0: i18n, 1: setI18n } = useState(null);

  useEffect(() => {
    if (!i18n) {
      (async () => {
        var i18nInstance = await getI18n(lng, ns, options);
        setI18n(i18nInstance);
      })();
    }
  }, [i18n, lng, ns, options, setI18n]);

  return {
    t: i18n?.t || ((x) => x),
    i18n: i18n?.i18n || null,
  };
}
