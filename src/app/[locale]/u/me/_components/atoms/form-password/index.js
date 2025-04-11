"use client";

import { useTranslation } from "react-i18next";
import { startTransition, useActionState } from "react";
import { SubmitButton } from "~/app/components/molecules/submit-button";
import { Input } from "~/app/components/atoms/input";
import { Alert } from "~/app/components/atoms/error";
import styles from "./styles.module.css";
import { changePassword } from "../../../actions";

export function FormPassword() {
  var { t } = useTranslation(undefined, {
    keyPrefix: "change_password",
  });

  var {
    0: state,
    1: action,
    2: pending,
  } = useActionState(changePassword);

  var handleSubmit = (e) => {
    e.preventDefault();
    var formData = new FormData(e.currentTarget);
    startTransition(() => {
      action(formData);
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.root}>
        <h2>{t("title")}</h2>
        <Input
          required
          id="oldPassword"
          type="password"
          name="oldPassword"
          label={t("old")}
        />
        <Input
          required
          id="newPassword"
          type="password"
          name="newPassword"
          label={t("new")}
        />
        {state?.success === false && (
          <Alert type="error" center>
            {t([`error.${state?.message}`, "error.fallback"])}
          </Alert>
        )}
      </div>
      <SubmitButton pending={pending}>{t("submit")}</SubmitButton>
    </form>
  );
}
