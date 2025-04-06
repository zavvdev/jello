"use client";

import { startTransition, useActionState } from "react";
import { deleteBoard } from "~/app/[locale]/u/boards/actions";
import { Button } from "~/app/components/atoms/button";

export function DeleteButton({ boardId, confirmMessage, children }) {
  var { 1: action, 2: pending } = useActionState(deleteBoard);

  var handleDelete = async () =>
    startTransition(() =>
      action({ boardId, redirectToBoards: true }),
    );

  return (
    <Button
      variant="danger"
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm(confirmMessage)) {
          handleDelete();
        }
      }}
    >
      {children}
    </Button>
  );
}
