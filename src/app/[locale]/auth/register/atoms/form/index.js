"use client";

import Link from "next/link";
import { startTransition, useActionState } from "react";
import { useTranslation } from "react-i18next";
import { registerAction } from "~/app/[locale]/auth/register/actions";
import { Error } from "~/app/components/atoms/error";
import { ErrorEntries } from "~/app/components/atoms/error-entries";
import { PUBLIC_ROUTES } from "~/app/routes";

export function Form() {
  var { t } = useTranslation();
  var { 0: state, 1: formAction, 2: pending } = useActionState(registerAction);

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
        <div>
          <p>
            {t("success.title")}{" "}
            <Link href={PUBLIC_ROUTES.auth.login()}>{t("success.link")}</Link>
          </p>
        </div>
      )}
      {!isSuccess && (
        <form action={formAction} onSubmit={handleSubmit}>
          {state?.success === false && (
            <>
              <Error>{t([`error.${state.message}`, "error.fallback"])}</Error>
              <ErrorEntries
                map={state?.extra}
                render={(key, value) => t(`validation_error.${key}.${value}`)}
              />
            </>
          )}
          <div>
            <label htmlFor="firstName">{t("first_name")}</label>
            <input required type="text" id="firstName" name="firstName" />
          </div>
          <div>
            <label htmlFor="lastName">{t("last_name")}</label>
            <input required type="text" id="lastName" name="lastName" />
          </div>
          <div>
            <label htmlFor="username">{t("username")}</label>
            <input required type="text" id="username" name="username" />
          </div>
          <div>
            <label htmlFor="email">{t("email")}</label>
            <input required type="email" id="email" name="email" />
          </div>
          <div>
            <label htmlFor="password">{t("password")}</label>
            <input required type="password" id="password" name="password" />
          </div>
          <div>
            <label htmlFor="confirmPassword">{t("confirm_password")}</label>
            <input
              required
              type="password"
              id="confirmPassword"
              name="confirmPassword"
            />
          </div>
          <button type="submit" disabled={pending}>
            {pending ? t("submitting") : t("submit")}
          </button>
        </form>
      )}
    </>
  );
}
