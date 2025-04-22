"use client";

import { useTranslation } from "react-i18next";
import { startTransition, useActionState, useEffect } from "react";
import { Button } from "~/app/components/atoms/button";
import { Input } from "~/app/components/atoms/input";
import { ValidationErrors } from "~/app/components/molecules/validation-errors";
import { Modal } from "~/app/components/atoms/modal";
import { mutateList } from "~/app/[locale]/u/boards/actions";
import styles from "./styles.module.css";

export function ModalMutateList({ boardId, onClose, initialData }) {
  var { t } = useTranslation(undefined, {
    keyPrefix: "mutate_list",
  });

  var {
    0: state,
    1: action,
    2: pending,
  } = useActionState(mutateList);

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
      title={initialData?.id ? t("edit") : t("add")}
      className={styles.modal}
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        {initialData?.id && (
          <input type="hidden" name="id" value={initialData.id} />
        )}
        <input type="hidden" name="boardId" value={boardId} />
        <Input
          id="name"
          name="name"
          label={t("name")}
          defaultValue={initialData?.name}
        />
        <Button type="submit" disabled={pending}>
          {initialData?.id ? t("save") : t("create")}
        </Button>
        {state?.success === false && (
          <ValidationErrors t={t} data={state} />
        )}
      </form>
    </Modal>
  );
}
