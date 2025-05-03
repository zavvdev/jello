"use client";

import { Button } from "~/app/components/atoms/button";
import { Alert } from "~/app/components/atoms/error";
import { Icons } from "~/app/components/icons";
import { DataSearchPicker } from "~/app/components/molecules/data-search-picker";
import styles from "./styles.module.css";

/**
 * @typedef {{
 *  id: number;
 *  username: string;
 *  first_name: string;
 *  last_name: string;
 * }} User
 *
 * @param {{
 *  title: string;
 *  emptyText: string;
 *  listName?: string;
 *  selected: Array<User>;
 *  onSelect: (user: User) => void;
 *  onRemove: (user: User) => void;
 *  data: Array<User>;
 *  className?: string;
 * }} param0
 */
export function UsersPicker({
  title,
  emptyText,
  listName,
  selected,
  onSelect,
  onRemove,
  data,
  className,
}) {
  var search = (user, term) => {
    var term_ = term?.toLowerCase() || "";
    return (
      user.username.toLowerCase().includes(term_) ||
      user.first_name.toLowerCase().includes(term_) ||
      user.last_name.toLowerCase().includes(term_)
    );
  };

  var renderItem = (user) => (
    <div>
      <div>
        {user.first_name} {user.last_name}
      </div>
      <i>@{user.username}</i>
    </div>
  );

  return (
    <div className={className}>
      <div>{title}</div>
      <DataSearchPicker
        data={data}
        keySelector={(user) => user.id}
        selectedKeys={selected.map((user) => user.id)}
        search={search}
        renderItem={renderItem}
        onSelect={onSelect}
      />
      <div className={styles.selection}>
        {selected.length === 0 ? (
          <Alert>{emptyText}</Alert>
        ) : (
          selected.map((user) => (
            <div className={styles.selected} key={user.id}>
              <div>
                <div>
                  {user.first_name} {user.last_name}
                </div>
                <i>@{user.username}</i>
              </div>
              <Button variant="danger" onClick={() => onRemove(user)}>
                <Icons.Trash width="1rem" />
              </Button>
              {listName && (
                <input
                  type="hidden"
                  name={`${listName}[]`}
                  value={JSON.stringify(user)}
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
