"use client";

import { useTranslation } from "react-i18next";
import { startTransition, useActionState } from "react";
import { Button } from "~/app/components/atoms/button";
import { deleteTask } from "~/app/[locale]/u/tasks/[id]/actions";
import { ApiErrors } from "~/app/components/molecules/api-errors";

export function DeleteButton({ boardId, id }) {
  var { t } = useTranslation();

  var {
    0: state,
    1: action,
    2: pending,
  } = useActionState(deleteTask);

  var handleDelete = async () =>
    startTransition(() => action({ boardId, taskId: id }));

  return (
    <div>
      <Button
        variant="danger"
        disabled={pending}
        onClick={() => {
          if (confirm(t("confirm.delete"))) {
            handleDelete();
          }
        }}
      >
        {t("actions.delete")}
      </Button>
      {state?.success === false && (
        <ApiErrors t={t} validation={false} data={state || {}} />
      )}
    </div>
  );
}
