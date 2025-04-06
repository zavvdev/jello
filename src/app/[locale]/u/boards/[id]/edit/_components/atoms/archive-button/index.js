"use client";

import { startTransition, useActionState } from "react";
import { toggleArchiveBoard } from "~/app/[locale]/u/boards/actions";
import { Button } from "~/app/components/atoms/button";

export function ArchiveButton({
  isArchived,
  boardId,
  confirmMessage,
  children,
}) {
  var { 1: action, 2: pending } = useActionState(toggleArchiveBoard);

  var toggle = () =>
    startTransition(() => action({ boardId, isArchived }));

  return (
    <Button
      variant="default"
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm(confirmMessage)) {
          toggle();
        }
      }}
    >
      {children}
    </Button>
  );
}
