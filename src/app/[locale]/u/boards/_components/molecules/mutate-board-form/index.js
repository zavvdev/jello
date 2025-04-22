"use client";

import { useTranslation } from "react-i18next";
import { startTransition, useActionState } from "react";
import { NAMESPACES } from "~/app/i18n/config";
import { SubmitButton } from "~/app/components/molecules/submit-button";
import { Input } from "~/app/components/atoms/input";
import { ValidationErrors } from "~/app/components/molecules/validation-errors";
import { Success } from "~/app/components/atoms/success";
import { TextArea } from "~/app/components/atoms/text-area";
import styles from "./styles.module.css";
import { AssignedUsers } from "./_components/atoms/assigned-users";
import { Labels } from "./_components/atoms/labels";
import { DEFAULT_COLOR } from "./config";
import { createBoard, updateBoard } from "../../../actions";

/**
 * @param {{
 *  initialValues: {
 *    id?: number;
 *    name: string;
 *    description: string;
 *    color: string;
 *    assignedUsers: Array<{
 *      id: number;
 *      first_name: string;
 *      last_name: string;
 *      username: string;
 *      role: string;
 *    }>;
 *    labels: Array<{ id: number; name: string; color: string }>;
 *  };
 *  title: string;
 *  submitText: string;
 *  type: "create" | "update";
 *  footer?: React.ReactNode;
 * }} param0
 */
export function MutateBoardForm({
  initialValues,
  title,
  submitText,
  type,
  footer,
}) {
  var {
    0: state,
    1: action,
    2: pending,
  } = useActionState(type === "create" ? createBoard : updateBoard);

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
        {initialValues?.id && (
          <input type="hidden" name="id" value={initialValues.id} />
        )}
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
        <AssignedUsers
          t={(k) => t(`assigned_users.${k}`)}
          users={initialValues?.assignedUsers}
        />
        <Labels
          t={(k) => t(`labels.${k}`)}
          labels={initialValues?.labels}
        />
        {state?.success === false && (
          <ValidationErrors t={t} data={state} />
        )}
        {state?.success && <Success>{t("success")}</Success>}
      </div>
      <SubmitButton pending={pending}>{submitText}</SubmitButton>
      <div className={styles.footer}>{footer}</div>
    </form>
  );
}
