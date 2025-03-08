"use client";

import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect } from "react";
import { loginAction } from "~/app/[lng]/auth/login/actions";
import { NAMESPACES } from "~/app/i18n/config";
import { useI18n } from "~/app/i18n/hooks/useI18n";
import { PRIVATE_ROUTES } from "~/app/routes";

export function Form() {
  var { t } = useI18n(NAMESPACES.auth);
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
        <p>{t([`login.error.${state.message}`, "login.error.fallback"])}</p>
      )}
      <div>
        <label htmlFor="usernameForEmail">{t("login.username_or_email")}</label>
        <input
          required
          type="text"
          id="usernameForEmail"
          name="usernameOrEmail"
        />
      </div>
      <div>
        <label htmlFor="password">{t("login.password")}</label>
        <input required type="password" id="password" name="password" />
      </div>
      <button type="submit" disabled={pending}>
        {pending ? t("login.submitting") : t("login.submit")}
      </button>
    </form>
  );
}
