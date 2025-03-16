"use client";

import { useEffect } from "react";
import { Icons } from "~/app/components/icons";
import styles from "~/app/[locale]/error.module.css";

export default function Error({ error }) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <div className={styles.root}>
      <Icons.ServerCrash height="150px" width="150px" />
      <h2>ERR: 500</h2>
    </div>
  );
}
