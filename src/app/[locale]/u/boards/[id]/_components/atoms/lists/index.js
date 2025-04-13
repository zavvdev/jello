"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { User } from "~/core/entity/models/user";
import { Icons } from "~/app/components/icons";
import { PRIVATE_ROUTES } from "~/app/routes";
import styles from "./styles.module.css";
import { ModalMutateList } from "./_components/atoms/modal-mutate-list";
import { DeleteButton } from "./_components/atoms/delete-button";

export function Lists({ boardId, role, data }) {
  var { t } = useTranslation();
  var { 0: mutateList, 1: setMutateList } = useState(null);

  return (
    <div className={styles.root}>
      {data.map((list) => (
        <div key={list.id} className={styles.list}>
          <div className={styles.listHeader}>
            {list.name}{" "}
            {User.canEditList(role) && (
              <button
                type="button"
                onClick={() => setMutateList(list)}
              >
                <Icons.Pencil width="0.9rem" />
              </button>
            )}
            {User.canDeleteList(role) && (
              <DeleteButton id={list.id} boardId={boardId} />
            )}
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
      {User.canCreateList(role) && (
        <div className={styles.addList}>
          <button
            type="button"
            className={styles.addButton}
            onClick={() => setMutateList({})}
          >
            <Icons.Plus width="1rem" />
            {t("add_list")}
          </button>
        </div>
      )}
      {!!mutateList && (
        <ModalMutateList
          isOpen
          boardId={boardId}
          onClose={() => setMutateList(null)}
          initialData={mutateList}
        />
      )}
    </div>
  );
}
