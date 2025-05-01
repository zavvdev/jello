"use client";

import { useTranslation } from "react-i18next";
import { startTransition, useActionState } from "react";
import { SubmitButton } from "~/app/components/molecules/submit-button";
import { updateTask } from "~/app/[locale]/u/boards/[boardId]/tasks/[taskId]/actions";
import { ApiErrors } from "~/app/components/molecules/api-errors";
import { Input } from "~/app/components/atoms/input";
import { Success } from "~/app/components/atoms/success";
import { TextArea } from "~/app/components/atoms/text-area";
import styles from "./styles.module.css";
import { DeleteButton } from "./_components/atoms/delete-button";

/**
 * @param {{
 *  boardId: string;
 *  taskId: number;
 *  canDelete: boolean;
 *  lists: Array<{
 *    id: number;
 *    name: string;
 *  }>;
 *  initialValues: {
 *    name: string;
 *    description: string;
 *    listId: string;
 *  };
 * }} param0
 */
export function FormBaseInfo({
  boardId,
  taskId,
  canDelete,
  lists,
  initialValues,
}) {
  var { t } = useTranslation(undefined, {
    keyPrefix: "base_info",
  });

  var {
    0: state,
    1: action,
    2: pending,
  } = useActionState(updateTask);

  var handleSubmit = (e) => {
    e.preventDefault();
    var formData = new FormData(e.currentTarget);
    startTransition(() => {
      action(formData);
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="id" value={taskId} />
      <div className={styles.root}>
        <Input
          required
          id="name"
          name="name"
          label={t("name")}
          defaultValue={initialValues.name}
        />
        <TextArea
          rows={10}
          id="description"
          name="description"
          label={t("description")}
          defaultValue={initialValues.description}
        />
        <select name="listId" defaultValue={initialValues.listId}>
          {lists.map((list) => (
            <option key={list.id} value={list.id}>
              {list.name}
            </option>
          ))}
        </select>
        {state?.success === false && <ApiErrors t={t} data={state} />}
        {state?.success && <Success>{t("success")}</Success>}
      </div>
      <div className={styles.footer}>
        <SubmitButton pending={pending}>{t("submit")}</SubmitButton>
        {canDelete && <DeleteButton boardId={boardId} id={taskId} />}
      </div>
    </form>
  );
}
