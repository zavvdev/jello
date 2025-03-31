"use client";

import { startTransition, useActionState } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "~/app/components/atoms/error";
import { Input } from "~/app/components/atoms/input";
import { Button } from "~/app/components/atoms/button";
import { loginAction } from "../../../actions";
import styles from "./styles.module.css";

export function Form() {
  var { t } = useTranslation();

  var {
    0: state,
    1: formAction,
    2: pending,
  } = useActionState(loginAction);

  var handleSubmit = (e) => {
    e.preventDefault();
    var formData = new FormData(e.currentTarget);
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      className={styles.root}
    >
      {state?.success === false && (
        <Alert type="error" center>
          {t([`error.${state.message}`, "error.fallback"])}
        </Alert>
      )}
      <Input
        required
        type="text"
        id="usernameForEmail"
        name="usernameOrEmail"
        label={t("username_or_email")}
      />
      <Input
        required
        type="password"
        id="password"
        name="password"
        label={t("password")}
      />
      <Button type="submit" disabled={pending}>
        {pending ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}
