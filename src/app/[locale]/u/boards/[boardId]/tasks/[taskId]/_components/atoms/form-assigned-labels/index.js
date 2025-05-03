"use client";

import { startTransition, useActionState, useState } from "react";
import { useTranslation } from "react-i18next";
import { LabelsPicker } from "~/app/components/organisms/labels-picker";
import { ApiErrors } from "~/app/components/molecules/api-errors";
import styles from "./styles.module.css";
import { assignLabel, removeLabel } from "../../../actions";

/**
 * @typedef {{
 *  id: number;
 *  color: string;
 *  name: string;
 * }} Label;
 *
 * @param {{
 *  boardLabels: Array<Label>;
 *  taskLabels: Array<Label>;
 *  taskId: number;
 * }} param0
 */
export function FormAssignedLabels({
  boardLabels,
  taskLabels,
  taskId,
}) {
  var { 0: selected, 1: setSelected } = useState(taskLabels);

  var { t } = useTranslation(undefined, {
    keyPrefix: "assigned_labels",
  });

  var { 0: assignLabelState, 1: assignLabelAction } =
    useActionState(assignLabel);

  var { 0: removeLabelState, 1: removeLabelAction } =
    useActionState(removeLabel);

  var remove = (label) => {
    setSelected((prev) => prev.filter((x) => x.id !== label.id));

    var formData = new FormData();
    formData.append("taskId", taskId);
    formData.append("labelId", label.id);

    startTransition(() => {
      removeLabelAction(formData);
    });
  };

  var select = (label) => {
    if (selected.find((l) => l.id === label.id)) {
      remove(label);
      return;
    }

    setSelected((prev) => [...prev, label]);

    var formData = new FormData();
    formData.append("taskId", taskId);
    formData.append("labelId", label.id);

    startTransition(() => {
      assignLabelAction(formData);
    });
  };

  return (
    <div className={styles.root}>
      <LabelsPicker
        title={t("title")}
        emptyText={t("empty")}
        selected={selected}
        onSelect={select}
        onRemove={remove}
        data={boardLabels}
      />
      {assignLabelState?.success === false && (
        <ApiErrors t={t} data={assignLabelState} />
      )}
      {removeLabelState?.success === false && (
        <ApiErrors t={t} data={removeLabelState} />
      )}
    </div>
  );
}
