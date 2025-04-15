"use client";

import { startTransition, useActionState } from "react";
import { toggleStarredBoard } from "~/app/[locale]/u/boards/actions";
import { Icons } from "~/app/components/icons";
import styles from "./styles.module.css";

export function StarButton({ boardId, starred }) {
  var { 1: action, 2: pending } = useActionState(toggleStarredBoard);

  return (
    <button
      type="submit"
      className={styles.root}
      disabled={pending}
      onClick={async () =>
        startTransition(() => action({ boardId, starred }))
      }
    >
      {starred ? <Icons.StarOff /> : <Icons.Star />}
    </button>
  );
}
