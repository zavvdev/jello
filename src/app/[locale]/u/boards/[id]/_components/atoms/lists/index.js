"use client";

import { startTransition, useEffect, useRef, useState } from "react";
import { createSwapy } from "swapy";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { User } from "~/core/entity/models/user";
import { Icons } from "~/app/components/icons";
import { PRIVATE_ROUTES } from "~/app/routes";
import { ModalMutateList } from "./_components/atoms/modal-mutate-list";
import { DeleteButton } from "./_components/atoms/delete-button";
import { reorderList } from "../../../../actions";
import styles from "./styles.module.css";

export function Lists({ boardId, role, data }) {
  var { t } = useTranslation();
  var { 0: mutateList, 1: setMutateList } = useState(null);

  var swapy = useRef(null);
  var container = useRef(null);

  useEffect(() => {
    if (container.current && User.canEditList(role)) {
      swapy.current = createSwapy(container.current, {
        animation: "none",
      });

      swapy.current.onSwapEnd((event) => {
        var nextIds = event.slotItemMap.asArray.map((x) => x.item);
        startTransition(() =>
          reorderList({ boardId, listIds: nextIds }),
        );
      });
    }

    return () => {
      swapy.current?.destroy();
    };
  }, [role, boardId]);

  return (
    <div ref={container} className={styles.root}>
      {data.map((list) => (
        <div
          key={list.id}
          data-swapy-slot={list.id}
          className={styles.listWrap}
        >
          <div
            key={list.id}
            data-swapy-item={list.id}
            className={styles.list}
          >
            <div className={styles.listHeader}>
              {User.canEditList(role) && (
                <Icons.GripVertical data-swapy-handle width="1rem" />
              )}
              {list.name}{" "}
              {User.canEditList(role) && (
                <button
                  type="button"
                  onClick={() => setMutateList(list)}
                >
                  <Icons.Pencil width="0.9rem" />
                </button>
              )}
              {User.canDeleteList(role) && (
                <DeleteButton id={list.id} boardId={boardId} />
              )}
            </div>
            <div className={styles.listContent}>
              {list.tasks.map((task) => (
                <Link
                  key={task.id}
                  href={PRIVATE_ROUTES.task(task.id)}
                  className={styles.task}
                >
                  {task.name}
                </Link>
              ))}
            </div>
            <div className={styles.listFooter}>
              <button type="button" className={styles.addButton}>
                <Icons.Plus width="1rem" />
                {t("add_task")}
              </button>
            </div>
          </div>
        </div>
      ))}
      {User.canCreateList(role) && (
        <div className={styles.addList}>
          <button
            type="button"
            className={styles.addButton}
            onClick={() => setMutateList({})}
          >
            <Icons.Plus width="1rem" />
            {t("add_list")}
          </button>
        </div>
      )}
      {!!mutateList && (
        <ModalMutateList
          isOpen
          boardId={boardId}
          onClose={() => setMutateList(null)}
          initialData={mutateList}
        />
      )}
    </div>
  );
}
