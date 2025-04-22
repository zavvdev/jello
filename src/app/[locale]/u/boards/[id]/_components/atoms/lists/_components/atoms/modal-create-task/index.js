"use client";

import { useTranslation } from "react-i18next";
import { startTransition, useActionState, useEffect } from "react";
import { Input } from "~/app/components/atoms/input";
import { ValidationErrors } from "~/app/components/molecules/validation-errors";
import { Modal } from "~/app/components/atoms/modal";
import { createTask } from "~/app/[locale]/u/boards/actions";
import { Button } from "~/app/components/atoms/button";
import { TextArea } from "~/app/components/atoms/text-area";
import styles from "./styles.module.css";
import { UsersPicker } from "./_components/shared/users-picker";
import { LabelsPicker } from "./_components/shared/labels-picker";

/**
 * @param {{
 *  boardId: number;
 *  listId: number;
 *  onClose: () => void;
 *  boardUsers: Array<{
 *    id: number;
 *    username: string;
 *    first_name: string;
 *    last_name: string;
 *  }>;
 *  boardLabels: Array<{
 *    id: number;
 *    color: string;
 *    name: string;
 *  }>;
 * }} param0
 */
export function ModalCreateTask({
  boardId,
  listId,
  onClose,
  boardUsers,
  boardLabels,
}) {
  var { t } = useTranslation(undefined, {
    keyPrefix: "create_task",
  });

  var {
    0: state,
    1: action,
    2: pending,
  } = useActionState(createTask);

  var handleSubmit = (e) => {
    e.preventDefault();
    var formData = new FormData(e.currentTarget);
    startTransition(() => {
      action(formData);
    });
  };

  useEffect(() => {
    if (state?.success) {
      onClose();
    }
  }, [state?.success, onClose]);

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={t("title")}
      className={styles.modal}
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        <input type="hidden" name="boardId" value={boardId} />
        <input type="hidden" name="listId" value={listId} />
        <Input id="name" name="name" label={t("name")} />
        <TextArea
          id="description"
          name="description"
          label={t("description")}
        />
        <UsersPicker data={boardUsers} />
        <LabelsPicker data={boardLabels} />
        {state?.success === false && (
          <ValidationErrors t={t} data={state} />
        )}
        <Button type="submit" disabled={pending}>
          {t("submit")}
        </Button>
      </form>
    </Modal>
  );
}
