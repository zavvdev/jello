"use client";

import { useState } from "react";
import { UserRole } from "~/core/entity/models/user";
import { SearchUsers } from "~/app/components/molecules/search-users";
import { Alert } from "~/app/components/atoms/error";
import { Icons } from "~/app/components/icons";
import styles from "./styles.module.css";

var collectRoles = (c, x) => ({ ...c, [x.id]: x.role });
var isMatchedBy = (id) => (x) => x.id === id;
var removeBy = (id) => (prev) => prev.filter((x) => x.id !== id);

/**
 * @param {{
 *  users: Array<{
 *    id: number;
 *    first_name: string;
 *    last_name: string;
 *    username: string;
 *    role: string;
 *  }>
 * }} @param0
 */
export function AssignedUsers({ users, t }) {
  var { 0: selected, 1: setSelected } = useState(users || []);

  var { 0: roles, 1: setRoles } = useState(
    users?.reduce(collectRoles, {}) || {},
  );

  var handleSelect = (user) => {
    if (selected?.find(isMatchedBy(user.id))) {
      setSelected(removeBy(user.id));
    } else {
      setSelected((prev) => [...prev, user]);
      setRoles((prev) => ({
        ...prev,
        [user.id]: UserRole.Admin,
      }));
    }
  };

  var handleSelectRole = (userId) => (e) =>
    setRoles((prev) => ({
      ...prev,
      [userId]: e.target.value,
    }));

  var handleRemove = (id) => {
    if (confirm(t("confirm.remove"))) {
      setSelected(removeBy(id));
    }
  };

  var renderUser = (user) => (
    <div key={user.id} className={styles.user}>
      <div className={styles.userInfo}>
        <div>
          <p>
            {user.first_name} {user.last_name}
          </p>
          <i>@{user.username}</i>
        </div>
        <select
          value={roles?.[user.id]}
          onChange={handleSelectRole(user.id)}
        >
          <option value={UserRole.Admin}>{t("admin")}</option>
          <option value={UserRole.Member}>{t("member")}</option>
        </select>
      </div>
      <button
        type="button"
        className={styles.userRemove}
        onClick={() => handleRemove(user.id)}
      >
        <Icons.Trash width="1rem" />
      </button>
      <input
        type="hidden"
        name="assigned_users[]"
        value={JSON.stringify({
          id: user.id,
          role: roles[user.id],
        })}
      />
    </div>
  );

  return (
    <div className={styles.root}>
      <h3>{t("title")}</h3>
      <SearchUsers
        onSelect={handleSelect}
        selectedIds={selected ? selected.map((x) => x.id) : []}
        t={{
          placeholder: t("search"),
        }}
      />
      <div>
        {selected?.length === 0 ? (
          <Alert type="warn">{t("empty")}</Alert>
        ) : (
          selected?.map(renderUser)
        )}
      </div>
    </div>
  );
}
