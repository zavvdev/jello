"use client";

import { useTranslation } from "react-i18next";
import { NAMESPACES } from "~/app/i18n/config";
import { Input } from "~/app/components/atoms/input";
import { TextArea } from "~/app/components/atoms/text-area";
import styles from "./styles.module.css";
import { AssignedUsers } from "./_components/assigned-users";

export function MutateBoardForm({ initialValues }) {
  var { t } = useTranslation(NAMESPACES.boards, {
    keyPrefix: "mutate_form",
  });

  return (
    <div className={styles.root}>
      <Input
        id="name"
        name="name"
        label={t("name")}
        defaultValue={initialValues?.name}
      />
      <TextArea
        id="description"
        name="description"
        label={t("description")}
        defaultValue={initialValues?.description}
      />
      <Input
        fitContent
        id="color"
        name="color"
        type="color"
        label={t("color")}
        defaultValue={initialValues?.color}
      />
      <AssignedUsers t={(k) => t(`assigned_users.${k}`)} />
    </div>
  );
}
