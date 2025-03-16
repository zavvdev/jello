"use client";

import { useEffect } from "react";
import { reportCriticalAppError } from "~/core/domain/utilities/crash-report";
import { Icons } from "~/app/components/icons";
import styles from "~/app/[locale]/error.module.css";

export default function Error({ error }) {
  useEffect(() => {
    reportCriticalAppError(error);
  }, [error]);

  return (
    <div className={styles.root}>
      <Icons.ServerCrash height="150px" width="150px" />
      <h2>ERR: 500</h2>
    </div>
  );
}
