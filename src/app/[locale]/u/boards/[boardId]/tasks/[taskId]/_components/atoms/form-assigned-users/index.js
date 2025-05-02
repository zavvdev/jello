"use client";

import { startTransition, useActionState, useState } from "react";
import { useTranslation } from "react-i18next";
import { UsersPicker } from "~/app/components/organisms/users-picker";
import { ApiErrors } from "~/app/components/molecules/api-errors";
import styles from "./styles.module.css";
import { assignUser } from "../../../actions";
import { removeUser } from "../../../actions";

/**
 * @typedef {{
 *  id: number;
 *  username: string;
 *  first_name: string;
 *  last_name: string;
 * }} User;
 *
 * @param {{
 *  boardUsers: Array<User>;
 *  taskUsers: Array<User>;
 *  taskId: number;
 * }} param0
 */
export function FormAssignedUsers({ boardUsers, taskUsers, taskId }) {
  var { 0: selected, 1: setSelected } = useState(taskUsers);

  var { t } = useTranslation(undefined, {
    keyPrefix: "assigned_users",
  });

  var { 0: assignUserState, 1: assignUserAction } =
    useActionState(assignUser);

  var { 0: removeUserState, 1: removeUserAction } =
    useActionState(removeUser);

  var remove = (user) => {
    setSelected((prev) => prev.filter((x) => x.id !== user.id));

    var formData = new FormData();
    formData.append("taskId", taskId);
    formData.append("userId", user.id);

    startTransition(() => {
      removeUserAction(formData);
    });
  };

  var select = (user) => {
    if (selected.find((u) => user.id === u.id)) {
      remove(user);
      return;
    }

    setSelected((prev) => [...prev, user]);

    var formData = new FormData();
    formData.append("taskId", taskId);
    formData.append("userId", user.id);

    startTransition(() => {
      assignUserAction(formData);
    });
  };

  return (
    <div className={styles.root}>
      <UsersPicker
        title={t("title")}
        emptyText={t("empty")}
        selected={selected}
        onSelect={select}
        onRemove={remove}
        data={boardUsers}
      />
      {assignUserState?.success === false && (
        <ApiErrors t={t} data={assignUserState} />
      )}
      {removeUserState?.success === false && (
        <ApiErrors t={t} data={removeUserState} />
      )}
    </div>
  );
}
