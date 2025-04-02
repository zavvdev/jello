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
  var { 0: labelName, 1: setLabelName } = useState("");
  var { 0: labelColor, 1: setLabelColor } = useState(DEFAULT_COLOR);

  var handleAdd = () => {
    if (!labelName) {
      return;
    }

    var label = {
      id: NewLabelId.create(),
      name: labelName,
      color: labelColor,
    };

    setList((prev) => [...prev, label]);
    setLabelName("");
    setLabelColor(DEFAULT_COLOR);
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
      <button
        type="button"
        className={styles.remove}
        onClick={() => handleRemove(id)}
      >
        <Icons.Trash width="1rem" />
      </button>
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
          value={labelName}
          onChange={(e) => setLabelName(e.target.value)}
        />
        <Input
          type="color"
          value={labelColor}
          onChange={(e) => setLabelColor(e.target.value)}
        />
        <button type="button" onClick={handleAdd}>
          <Icons.Plus width="1rem" />
        </button>
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
