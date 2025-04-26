import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "~/app/components/atoms/button";
import { Alert } from "~/app/components/atoms/error";
import { Icons } from "~/app/components/icons";
import { DataSearchPicker } from "~/app/components/molecules/data-search-picker";
import styles from "./styles.module.css";

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

  var search = (user, term) => {
    var term_ = term?.toLowerCase() || "";
    return (
      user.username.toLowerCase().includes(term_) ||
      user.first_name.toLowerCase().includes(term_) ||
      user.last_name.toLowerCase().includes(term_)
    );
  };

  var select = (user) => {
    setSelected((prev) => {
      if (prev.find((u) => user.id === u.id)) {
        return prev.filter((u) => u.id !== user.id);
      }
      return [...prev, user];
    });
  };

  var renderItem = (user) => (
    <div>
      <div>
        {user.first_name} {user.last_name}
      </div>
      <i>@{user.username}</i>
    </div>
  );

  var remove = (user) => () =>
    setSelected((prev) => prev.filter((x) => x.id !== user.id));

  return (
    <div>
      <div>{t("assigned_users")}</div>
      <DataSearchPicker
        data={data}
        keySelector={(user) => user.id}
        selectedKeys={selected.map((user) => user.id)}
        search={search}
        renderItem={renderItem}
        onSelect={select}
      />
      <div className={styles.selection}>
        {selected.length === 0 ? (
          <Alert>{t("no_users_selected")}</Alert>
        ) : (
          selected.map((user) => (
            <div className={styles.selected} key={user.id}>
              <div>
                <div>
                  {user.first_name} {user.last_name}
                </div>
                <i>@{user.username}</i>
              </div>
              <Button variant="danger" onClick={remove(user)}>
                <Icons.Trash width="1rem" />
              </Button>
              <input
                type="hidden"
                name="assigned_users[]"
                value={JSON.stringify(user)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
