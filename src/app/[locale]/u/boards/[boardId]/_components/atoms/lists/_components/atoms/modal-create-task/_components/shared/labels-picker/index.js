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
 *    color: string;
 *    name: string;
 *  }>;
 * }} param0
 */
export function LabelsPicker({ data }) {
  var { 0: selected, 1: setSelected } = useState([]);

  var { t } = useTranslation(undefined, {
    keyPrefix: "create_task",
  });

  var search = (label, term) =>
    label.name.toLowerCase().includes(term?.toLowerCase() || "");

  var select = (label) => {
    setSelected((prev) => {
      if (prev.find((l) => l.id === label.id)) {
        return prev.filter((l) => l.id !== label.id);
      }
      return [...prev, label];
    });
  };

  var renderItem = (label) => (
    <div className={styles.label}>
      <div
        className={styles.color}
        style={{ backgroundColor: label.color }}
      />
      <div>{label.name}</div>
    </div>
  );

  var remove = (label) => () =>
    setSelected((prev) => prev.filter((x) => x.id !== label.id));

  return (
    <div>
      <div>{t("assigned_labels")}</div>
      <DataSearchPicker
        keepDataVisible
        data={data}
        keySelector={(label) => label.id}
        selectedKeys={selected.map((label) => label.id)}
        search={search}
        renderItem={renderItem}
        onSelect={select}
      />
      <div className={styles.selection}>
        {selected.length === 0 ? (
          <Alert>{t("no_labels_selected")}</Alert>
        ) : (
          selected.map((label) => (
            <div className={styles.selected} key={label.id}>
              {renderItem(label)}
              <Button variant="danger" onClick={remove(label)}>
                <Icons.Trash width="1rem" />
              </Button>
              <input
                type="hidden"
                name="assigned_labels[]"
                value={JSON.stringify(label)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
