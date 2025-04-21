"use client";

import { useTranslation } from "react-i18next";
import { startTransition, useActionState } from "react";
import { SubmitButton } from "~/app/components/molecules/submit-button";
import { ValidationErrors } from "~/app/components/molecules/validation-errors";
import { Input } from "~/app/components/atoms/input";
import { Success } from "~/app/components/atoms/success";
import { TextArea } from "~/app/components/atoms/text-area";
import styles from "./styles.module.css";
import { updateProfile } from "../../../actions";

/**
 * @param {{
 *  initialValues: {
 *    firstName: string;
 *    lastName: string;
 *    username: string;
 *    email: string;
 *    bio: string;
 *  };
 * }} param0
 */
export function FormInfo({ initialValues }) {
  var { t } = useTranslation(undefined, {
    keyPrefix: "info",
  });

  var {
    0: state,
    1: action,
    2: pending,
  } = useActionState(updateProfile);

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
        <div className={styles.row}>
          <Input
            required
            id="firstName"
            name="firstName"
            label={t("first_name")}
            defaultValue={initialValues.firstName}
          />
          <Input
            required
            id="lastName"
            name="lastName"
            label={t("last_name")}
            defaultValue={initialValues.lastName}
          />
        </div>
        <div className={styles.row}>
          <Input
            required
            id="username"
            name="username"
            label={t("username")}
            defaultValue={initialValues.username}
          />
          <Input
            required
            id="email"
            name="email"
            type="email"
            label={t("email")}
            defaultValue={initialValues.email}
          />
        </div>
        <TextArea
          id="bio"
          name="bio"
          label={t("bio")}
          defaultValue={initialValues.bio}
        />
        {state?.success === false && (
          <ValidationErrors t={t} data={state} />
        )}
        {state?.success && <Success>{t("success")}</Success>}
      </div>
      <SubmitButton pending={pending}>{t("submit")}</SubmitButton>
    </form>
  );
}
