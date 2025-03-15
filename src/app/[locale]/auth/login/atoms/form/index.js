"use client";

import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { loginAction } from "~/app/[locale]/auth/login/actions";
import { Error } from "~/app/components/atoms/error";
import { PRIVATE_ROUTES } from "~/app/routes";

export function Form() {
  var { t } = useTranslation();
  var { 0: state, 1: formAction, 2: pending } = useActionState(loginAction);
  var router = useRouter();

  var handleSubmit = (e) => {
    e.preventDefault();
    var formData = new FormData(e.currentTarget);
    startTransition(() => {
      formAction(formData);
    });
  };

  useEffect(() => {
    if (state?.success) {
      router.push(PRIVATE_ROUTES.dashboard());
    }
  }, [state?.success, router]);

  return (
    <form action={formAction} onSubmit={handleSubmit}>
      {state?.success === false && (
        <Error>{t([`error.${state.message}`, "error.fallback"])}</Error>
      )}
      <div>
        <label htmlFor="usernameForEmail">{t("username_or_email")}</label>
        <input
          required
          type="text"
          id="usernameForEmail"
          name="usernameOrEmail"
        />
      </div>
      <div>
        <label htmlFor="password">{t("password")}</label>
        <input required type="password" id="password" name="password" />
      </div>
      <button type="submit" disabled={pending}>
        {pending ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
