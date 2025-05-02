"use client";

import { Button } from "~/app/components/atoms/button";
import { Alert } from "~/app/components/atoms/error";
import { Icons } from "~/app/components/icons";
import { DataSearchPicker } from "~/app/components/molecules/data-search-picker";
import styles from "./styles.module.css";

/**
 * @typedef {{
 *  id: number;
 *  color: string;
 *  name: string;
 * }} Label;
 *
 * @param {{
 *  title: string;
 *  emptyText: string;
 *  selected: Array<Label>;
 *  onSelect: (label: Label) => void;
 *  onRemove: (label: Label) => void;
 *  data: Array<Label>;
 *  className?: string;
 *  keepDataVisible?: boolean;
 *  listName?: string;
 * }} param0
 */
export function LabelsPicker({
  title,
  emptyText,
  selected,
  onSelect,
  onRemove,
  data,
  className,
  keepDataVisible,
  listName,
}) {
  var search = (label, term) =>
    label.name.toLowerCase().includes(term?.toLowerCase() || "");

  var renderItem = (label) => (
    <div className={styles.label}>
      <div
        className={styles.color}
        style={{ backgroundColor: label.color }}
      />
      <div>{label.name}</div>
    </div>
  );

  return (
    <div className={className}>
      <div>{title}</div>
      <DataSearchPicker
        keepDataVisible={keepDataVisible}
        data={data}
        keySelector={(label) => label.id}
        selectedKeys={selected.map((label) => label.id)}
        search={search}
        renderItem={renderItem}
        onSelect={onSelect}
      />
      <div className={styles.selection}>
        {selected.length === 0 ? (
          <Alert>{emptyText}</Alert>
        ) : (
          selected.map((label) => (
            <div className={styles.selected} key={label.id}>
              {renderItem(label)}
              <Button
                variant="danger"
                onClick={() => onRemove(label)}
              >
                <Icons.Trash width="1rem" />
              </Button>
              {listName && (
                <input
                  type="hidden"
                  name={`${listName}[]`}
                  value={JSON.stringify(label)}
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
