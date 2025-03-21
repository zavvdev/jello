"use client";

import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Error } from "~/app/components/atoms/error";
import { PRIVATE_ROUTES } from "~/app/routes";
import { Input } from "~/app/components/atoms/input";
import { Button } from "~/app/components/atoms/button";
import { loginAction } from "../actions";
import styles from "./styles.module.css";

export function Form() {
  var { t } = useTranslation();
  var router = useRouter();

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

  useEffect(() => {
    if (state?.success) {
      router.push(PRIVATE_ROUTES.boards());
    }
  }, [state?.success, router]);

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      className={styles.root}
    >
      {state?.success === false && (
        <Error center>
          {t([`error.${state.message}`, "error.fallback"])}
        </Error>
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
      <Button variant="primary" type="submit" disabled={pending}>
        {pending ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}
