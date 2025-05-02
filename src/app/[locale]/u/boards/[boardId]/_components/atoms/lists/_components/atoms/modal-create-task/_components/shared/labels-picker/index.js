import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LabelsPicker as OLabelsPicker } from "~/app/components/organisms/labels-picker";

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

  var select = (label) => {
    setSelected((prev) => {
      if (prev.find((l) => l.id === label.id)) {
        return prev.filter((l) => l.id !== label.id);
      }
      return [...prev, label];
    });
  };

  var remove = (label) =>
    setSelected((prev) => prev.filter((x) => x.id !== label.id));

  return (
    <OLabelsPicker
      title={t("assigned_labels")}
      emptyText={t("no_labels_selected")}
      listName="assigned_labels"
      selected={selected}
      onSelect={select}
      onRemove={remove}
      data={data}
    />
  );
}
