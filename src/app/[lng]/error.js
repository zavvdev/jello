"use client";

import { useEffect } from "react";
import { reportCriticalAppError } from "~/domain/utilities/error-reports";
import { NAMESPACES } from "~/app/i18n/config";
import { useI18n } from "~/app/i18n/hooks/useI18n";
import { Icons } from "~/app/components/icons";
import styles from "~/app/styles/error.module.css";

export default function Error({ error }) {
  var { t } = useI18n(NAMESPACES.common);

  useEffect(() => {
    reportCriticalAppError(error);
  }, [error]);

  return (
    <div className={styles.root}>
      <Icons.ServerCrash height="150px" width="150px" />
      <h2>{t("critical_client_error")}</h2>
    </div>
  );
}
