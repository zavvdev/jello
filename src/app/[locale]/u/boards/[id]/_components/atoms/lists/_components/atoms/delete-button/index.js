"use client";

import { useTranslation } from "react-i18next";
import { startTransition, useActionState } from "react";
import { deleteList } from "~/app/[locale]/u/boards/actions";
import { Icons } from "~/app/components/icons";
import styles from "./styles.module.css";

export function DeleteButton({ boardId, id }) {
  var { t } = useTranslation();

  var { 1: action, 2: pending } = useActionState(deleteList);

  var handleDelete = async () =>
    startTransition(() => action({ boardId, id }));

  return (
    <button
      disabled={pending}
      className={styles.root}
      onClick={() => {
        if (confirm(t("confirm.delete_list"))) {
          handleDelete();
        }
      }}
    >
      <Icons.Trash width="0.9rem" />
    </button>
  );
}
