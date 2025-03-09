"use client";

import Link from "next/link";
import { startTransition, useActionState } from "react";
import { registerAction } from "~/app/[lng]/auth/register/actions";
import { NAMESPACES } from "~/app/i18n/config";
import { useI18n } from "~/app/i18n/hooks/useI18n";
import { PUBLIC_ROUTES } from "~/app/routes";

export function Form() {
  var { t } = useI18n(NAMESPACES.auth);
  var { 0: state, 1: formAction, 2: pending } = useActionState(registerAction);

  var handleSubmit = (e) => {
    e.preventDefault();
    var formData = new FormData(e.currentTarget);
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <>
      {state?.success ? (
        <div>
          <p>
            {t("register.success.title")}{" "}
            <Link href={PUBLIC_ROUTES.auth.login()}>
              {t("register.success.link")}
            </Link>
          </p>
        </div>
      ) : (
        <form action={formAction} onSubmit={handleSubmit}>
          {state?.success === false && (
            <p>
              {t([
                `register.error.${state.message}`,
                "register.error.fallback",
              ])}
            </p>
          )}
          <div>
            <label htmlFor="firstName">{t("register.first_name")}</label>
            <input required type="text" id="firstName" name="firstName" />
          </div>
          <div>
            <label htmlFor="lastName">{t("register.last_name")}</label>
            <input required type="text" id="lastName" name="lastName" />
          </div>
          <div>
            <label htmlFor="username">{t("register.username")}</label>
            <input required type="text" id="username" name="username" />
          </div>
          <div>
            <label htmlFor="email">{t("register.email")}</label>
            <input required type="email" id="email" name="email" />
          </div>
          <div>
            <label htmlFor="password">{t("register.password")}</label>
            <input required type="password" id="password" name="password" />
          </div>
          <div>
            <label htmlFor="confirmPassword">
              {t("register.confirm_password")}
            </label>
            <input
              required
              type="password"
              id="confirmPassword"
              name="confirmPassword"
            />
          </div>
          <button type="submit" disabled={pending}>
            {pending ? t("register.submitting") : t("register.submit")}
          </button>
        </form>
      )}
    </>
  );
}
