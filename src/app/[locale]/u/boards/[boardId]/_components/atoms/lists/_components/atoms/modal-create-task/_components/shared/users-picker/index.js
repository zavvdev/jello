import { useState } from "react";
import { useTranslation } from "react-i18next";
import { UsersPicker as OUsersPicker } from "~/app/components/organisms/users-picker";

/**
 * @param {{
 *  data: Array<{
 *    id: number;
 *    username: string;
 *    first_name: string;
 *    last_name: string;
 *  }>;
 * }} param0
 */
export function UsersPicker({ data }) {
  var { 0: selected, 1: setSelected } = useState([]);

  var { t } = useTranslation(undefined, {
    keyPrefix: "create_task",
  });

  var select = (user) => {
    setSelected((prev) => {
      if (prev.find((u) => user.id === u.id)) {
        return prev.filter((u) => u.id !== user.id);
      }
      return [...prev, user];
    });
  };

  var remove = (user) =>
    setSelected((prev) => prev.filter((x) => x.id !== user.id));

  return (
    <OUsersPicker
      title={t("assigned_users")}
      emptyText={t("no_users_selected")}
      listName="assigned_users"
      selected={selected}
      onSelect={select}
      onRemove={remove}
      data={data}
    />
  );
}
