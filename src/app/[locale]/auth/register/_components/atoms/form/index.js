"use client";

import Link from "next/link";
import { startTransition, useActionState } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "~/app/components/atoms/error";
import { ErrorEntries } from "~/app/components/atoms/error-entries";
import { PUBLIC_ROUTES } from "~/app/routes";
import { Input } from "~/app/components/atoms/input";
import { Success } from "~/app/components/atoms/success";
import { Button } from "~/app/components/atoms/button";
import styles from "./styles.module.css";
import { registerAction } from "../../../actions";

export function Form() {
  var { t } = useTranslation();

  var {
    0: state,
    1: formAction,
    2: pending,
  } = useActionState(registerAction);

  var handleSubmit = (e) => {
    e.preventDefault();
    var formData = new FormData(e.currentTarget);
    startTransition(() => {
      formAction(formData);
    });
  };

  var isSuccess = state?.success === true;

  return (
    <>
      {isSuccess && (
        <Success>
          {t("success.title")}{" "}
          <Link href={PUBLIC_ROUTES.auth.login()}>
            {t("success.link")}
          </Link>
        </Success>
      )}
      {!isSuccess && (
        <form
          action={formAction}
          onSubmit={handleSubmit}
          className={styles.form}
        >
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
          <Input
            required
            id="firstName"
            name="firstName"
            type="text"
            label={t("first_name")}
          />
          <Input
            required
            id="lastName"
            name="lastName"
            type="text"
            label={t("last_name")}
          />
          <Input
            required
            id="username"
            name="username"
            type="text"
            label={t("username")}
          />
          <Input
            required
            id="email"
            name="email"
            type="email"
            label={t("email")}
          />
          <Input
            required
            id="password"
            name="password"
            type="password"
            label={t("password")}
          />
          <Input
            required
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label={t("confirm_password")}
          />
          <Button type="submit" disabled={pending}>
            {pending ? t("submitting") : t("submit")}
          </Button>
        </form>
      )}
    </>
  );
}
