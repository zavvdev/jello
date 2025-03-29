"use client";

import cx from "clsx";
import { startTransition, useActionState } from "react";
import { deleteBoard } from "~/app/[locale]/u/boards/actions";
import { Icons } from "~/app/components/icons";
import styles from "./styles.module.css";

export function DeleteButton({ className, boardId, confirmMessage }) {
  var { 1: action, 2: pending } = useActionState(deleteBoard);

  var handleDelete = async () =>
    startTransition(() => action({ boardId }));

  return (
    <button
      disabled={pending}
      className={cx(styles.root, className)}
      onClick={() => {
        if (confirm(confirmMessage)) {
          handleDelete();
        }
      }}
    >
      <Icons.Trash />
    </button>
  );
}
