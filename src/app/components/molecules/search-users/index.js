"use client";

import cx from "clsx";
import { startTransition, useActionState, useState } from "react";
import { Input } from "~/app/components/atoms/input";
import { Icons } from "~/app/components/icons";
import styles from "./styles.module.css";
import { searchUsers } from "./actions";

/**
 * @param {{
 *  t: { placeholder: string };
 *  onSelect: (user: {
 *    id: number;
 *    first_name: string;
 *    last_name: string;
 *    username: string;
 *  }) => void;
 *  selectedIds: Array<number>;
 * }} @param0
 */
export function SearchUsers({ t, onSelect, selectedIds }) {
  var { 0: search, 1: setSearch } = useState("");

  var {
    0: result,
    1: action,
    2: pending,
  } = useActionState(searchUsers);

  var renderResult = (user) => (
    <button
      key={user.id}
      type="button"
      onClick={() => onSelect(user)}
      className={cx({
        [styles.selected]: selectedIds?.includes(user.id),
      })}
    >
      <p>
        {user.first_name} {user.last_name}
      </p>
      <span>@{user.username}</span>
    </button>
  );

  return (
    <div className={styles.root}>
      <div className={styles.searchBar}>
        <Input
          name="username"
          placeholder={t?.placeholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          disabled={pending}
          onClick={() =>
            startTransition(() => action({ username: search }))
          }
        >
          <Icons.Search width="1rem" />
        </button>
      </div>
      {result?.length > 0 && (
        <div className={styles.searchResult}>
          {result?.map(renderResult)}
        </div>
      )}
    </div>
  );
}
