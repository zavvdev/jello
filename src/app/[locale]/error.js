"use client";

import { useEffect } from "react";
import { handleClientError } from "~/core/domain/error-handling";
import { Icons } from "~/app/components/icons";
import styles from "~/app/[locale]/error.module.css";

export default function Error({ error }) {
  useEffect(() => {
    handleClientError(error, "Error Boundary");
  }, [error]);

  return (
    <div className={styles.root}>
      <Icons.ServerCrash height="150px" width="150px" />
      <h2>ERR: 500</h2>
      {process.env.NODE_ENV === "development" && (
        <pre>
          {error?.message}
          {error?.stack}
        </pre>
      )}
    </div>
  );
}
