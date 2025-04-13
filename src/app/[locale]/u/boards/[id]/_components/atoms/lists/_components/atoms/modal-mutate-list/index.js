"use client";

import { useTranslation } from "react-i18next";
import { startTransition, useActionState, useEffect } from "react";
import { Button } from "~/app/components/atoms/button";
import { Input } from "~/app/components/atoms/input";
import { Modal } from "~/app/components/atoms/modal";
import { mutateList } from "~/app/[locale]/u/boards/actions";
import { Alert } from "~/app/components/atoms/error";
import { ErrorEntries } from "~/app/components/atoms/error-entries";
import styles from "./styles.module.css";

export function ModalMutateList({
  boardId,
  isOpen,
  onClose,
  initialData,
}) {
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
    if (state?.success && isOpen) {
      onClose();
    }
  }, [state?.success, onClose, isOpen]);

  return (
    <Modal
      isOpen={isOpen}
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
          <div>
            <Alert type="error" center>
              {t([`error.${state.message}`, "error.fallback"])}
            </Alert>
            <ErrorEntries
              map={state?.extra}
              render={(key, value) =>
                t(`validation_error.${key}.${value}`)
              }
            />
          </div>
        )}
      </form>
    </Modal>
  );
}
