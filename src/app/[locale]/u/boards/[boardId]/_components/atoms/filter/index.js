"use client";

import Form from "next/form";
import { useTranslation } from "react-i18next";
import { PRIVATE_ROUTES } from "~/app/routes";
import { Input } from "~/app/components/atoms/input";
import { SubmitButton } from "~/app/components/molecules/submit-button";
import styles from "./styles.module.css";

export function Filter({ boardId, users, labels, searchParams }) {
  var { t } = useTranslation(undefined, {
    keyPrefix: "filter",
  });

  return (
    <Form
      className={styles.form}
      action={PRIVATE_ROUTES.board(boardId)}
    >
      <div className={styles.inputWrap}>
        <label htmlFor="search">{t("search")}</label>
        <Input
          id="search"
          name="search"
          placeholder={t("search")}
          defaultValue={searchParams.search}
        />
      </div>
      <div className={styles.inputWrap}>
        <label htmlFor="user_id">{t("user")}</label>
        <select
          id="user_id"
          name="user_id"
          defaultValue={searchParams.user_id}
        >
          <option value="">{t("any")}</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.first_name} {user.last_name} (@{user.username})
            </option>
          ))}
        </select>
      </div>
      <div className={styles.inputWrap}>
        <label htmlFor="label_id">{t("label")}</label>
        <select
          id="label_id"
          name="label_id"
          defaultValue={searchParams.label_id}
        >
          <option value="">{t("any")}</option>
          {labels.map((label) => (
            <option key={label.id} value={label.id}>
              {label.name}
            </option>
          ))}
        </select>
      </div>
      <SubmitButton>{t("apply")}</SubmitButton>
    </Form>
  );
}
