"use client";

import { useTranslation } from "react-i18next";
import { startTransition, useActionState } from "react";
import { Button } from "~/app/components/atoms/button";
import { Alert } from "~/app/components/atoms/error";
import { deleteProfile } from "../../../actions";

export function DeleteProfile() {
  var {
    0: state,
    1: action,
    2: pending,
  } = useActionState(deleteProfile);

  var { t } = useTranslation(undefined, {
    keyPrefix: "delete",
  });

  var handleDelete = () => startTransition(() => action());

  return (
    <>
      <Button
        variant="danger"
        disabled={pending}
        onClick={() => {
          if (confirm(t("confirm"))) {
            handleDelete();
          }
        }}
      >
        {t("button")}
      </Button>
      <br />
      <br />
      {state?.success === false && (
        <Alert type="error">{t("error.fallback")}</Alert>
      )}
    </>
  );
}
