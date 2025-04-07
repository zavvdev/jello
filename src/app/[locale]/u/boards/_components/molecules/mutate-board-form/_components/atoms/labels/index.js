"use client";

import { useState } from "react";
import { Alert } from "~/app/components/atoms/error";
import { Input } from "~/app/components/atoms/input";
import { Icons } from "~/app/components/icons";
import styles from "./styles.module.css";
import { NewLabelId } from "./utilities";
import { DEFAULT_COLOR } from "../../../config";

/**
 * @param {{
 *  labels: Array<{
 *    id: number;
 *    name: string;
 *    color: string;
 *  }>;
 *  t: (key: string) => string;
 * }} @param0
 */
export function Labels({ labels, t }) {
  var { 0: list, 1: setList } = useState(labels || []);
  var { 0: editId, 1: setEditId } = useState();
  var { 0: name, 1: setName } = useState("");
  var { 0: color, 1: setColor } = useState(DEFAULT_COLOR);

  var reset = () => {
    setName("");
    setColor(DEFAULT_COLOR);
    setEditId(undefined);
  };

  var handleAdd = () => {
    if (!name) {
      return;
    }

    var label = {
      id: NewLabelId.create(),
      name,
      color,
    };

    setList((prev) => [...prev, label]);
    reset();
  };

  var handleSave = () => {
    if (!name) {
      return;
    }

    setList((prev) =>
      prev.map((x) => (x.id === editId ? { ...x, name, color } : x)),
    );

    reset();
  };

  var handleRemove = (id) => {
    setList((prev) => prev.filter((x) => x.id !== id));
  };

  var renderLabel = ({ id, name, color }) => (
    <div key={id} className={styles.label}>
      <div className={styles.info}>
        <div
          className={styles.color}
          style={{ backgroundColor: color }}
        />
        <span>{name}</span>
      </div>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.edit}
          onClick={() => {
            setEditId(id);
            setName(name);
            setColor(color);
          }}
        >
          <Icons.Pencil width="1rem" />
        </button>
        <button
          type="button"
          className={styles.remove}
          onClick={() => handleRemove(id)}
        >
          <Icons.Trash width="1rem" />
        </button>
      </div>
      <input
        type="hidden"
        name="labels[]"
        value={JSON.stringify({
          id: id,
          name: name,
          color: color,
        })}
      />
    </div>
  );

  return (
    <div className={styles.root}>
      <h3>{t("title")}</h3>
      <div className={styles.form}>
        <Input
          id="name"
          placeholder={t("name")}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        {editId ? (
          <div className={styles.actions}>
            <button type="button" onClick={handleSave}>
              <Icons.Save width="1rem" />
            </button>
            <button type="button" onClick={reset}>
              <Icons.CircleX width="1rem" />
            </button>
          </div>
        ) : (
          <button type="button" onClick={handleAdd}>
            <Icons.Plus width="1rem" />
          </button>
        )}
      </div>
      <div>
        {list?.length === 0 ? (
          <Alert type="warn">{t("empty")}</Alert>
        ) : (
          list?.map(renderLabel)
        )}
      </div>
    </div>
  );
}
