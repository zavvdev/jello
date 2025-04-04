"use client";

import { useTranslation } from "react-i18next";
import { startTransition, useActionState } from "react";
import { NAMESPACES } from "~/app/i18n/config";
import { SubmitButton } from "~/app/components/molecules/submit-button";
import { Input } from "~/app/components/atoms/input";
import { ErrorEntries } from "~/app/components/atoms/error-entries";
import { Alert } from "~/app/components/atoms/error";
import { TextArea } from "~/app/components/atoms/text-area";
import styles from "./styles.module.css";
import { AssignedUsers } from "./_components/atoms/assigned-users";
import { Labels } from "./_components/atoms/labels";
import { DEFAULT_COLOR } from "./config";
import { createBoard } from "../../../actions";

/**
 * @param {{
 *  initialValues: {
 *    name: string;
 *    description: string;
 *    color: string;
 *    assignedUsers: Array<{ id: number; name: string; role: string }>;
 *    labels: Array<{ id: number; name: string; color: string }>;
 *  };
 *  title: string;
 *  submitText: string;
 *  type: "create" | "update";
 */
export function MutateBoardForm({
  initialValues,
  title,
  submitText,
  type,
}) {
  var {
    0: state,
    1: action,
    2: pending,
  } = useActionState(type === "create" ? createBoard : () => {});

  var { t } = useTranslation(NAMESPACES.boards, {
    keyPrefix: "mutate_form",
  });

  var handleSubmit = (e) => {
    e.preventDefault();
    var formData = new FormData(e.currentTarget);
    startTransition(() => {
      action(formData);
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>{title}</h1>
      <div className={styles.root}>
        <Input
          id="name"
          name="name"
          label={t("name")}
          defaultValue={initialValues?.name}
        />
        <TextArea
          id="description"
          name="description"
          label={t("description")}
          defaultValue={initialValues?.description}
        />
        <Input
          fitContent
          id="color"
          name="color"
          type="color"
          label={t("color")}
          defaultValue={initialValues?.color || DEFAULT_COLOR}
        />
        <AssignedUsers t={(k) => t(`assigned_users.${k}`)} />
        <Labels
          t={(k) => t(`labels.${k}`)}
          labels={initialValues?.labels}
        />
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
      </div>
      <SubmitButton pending={pending}>{submitText}</SubmitButton>
    </form>
  );
}
