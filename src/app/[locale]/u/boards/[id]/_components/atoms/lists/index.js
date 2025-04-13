"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Icons } from "~/app/components/icons";
import { PRIVATE_ROUTES } from "~/app/routes";
import styles from "./styles.module.css";

export function Lists({ data }) {
  var { t } = useTranslation();

  return (
    <div className={styles.root}>
      {data.map((list) => (
        <div key={list.id} className={styles.list}>
          <div className={styles.listHeader}>
            {list.name}{" "}
            <button type="button">
              <Icons.Pencil width="0.9rem" />
            </button>
          </div>
          <div className={styles.listContent}>
            {list.tasks.map((task) => (
              <Link
                key={task.id}
                href={PRIVATE_ROUTES.task(task.id)}
                className={styles.task}
              >
                {task.name}
              </Link>
            ))}
          </div>
          <div className={styles.listFooter}>
            <button type="button" className={styles.addButton}>
              <Icons.Plus width="1rem" />
              {t("add_task")}
            </button>
          </div>
        </div>
      ))}
      <div className={styles.addList}>
        <button type="button" className={styles.addButton}>
          <Icons.Plus width="1rem" />
          {t("add_list")}
        </button>
      </div>
    </div>
  );
}
