import { useTranslation } from "react-i18next";
import { startTransition, useActionState } from "react";
import { Icons } from "~/app/components/icons";
import styles from "./styles.module.css";
import { deleteComment } from "../../../../../../actions";

export function Comment({
  taskId,
  boardId,
  canEdit,
  id,
  body,
  author,
  createdAt,
  onEdit,
}) {
  var { t } = useTranslation(undefined, {
    keyPrefix: "comments",
  });

  var { 1: deleteAction, 2: isDeleting } =
    useActionState(deleteComment);

  var handleDelete = () =>
    startTransition(() =>
      deleteAction({ boardId, taskId, commentId: id }),
    );

  return (
    <div className={styles.root}>
      <div className={styles.body}>{body}</div>
      <div className={styles.footer}>
        {canEdit && (
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.edit}
              onClick={onEdit}
            >
              <Icons.Pencil width="0.7rem" />
            </button>
            <button
              type="button"
              className={styles.delete}
              disabled={isDeleting}
              onClick={() => {
                if (confirm(t("confirm.delete"))) {
                  handleDelete();
                }
              }}
            >
              <Icons.Trash width="0.7rem" />
            </button>
          </div>
        )}
        <div className={styles.date}>{createdAt}</div>
        <div>
          <b>
            {author.first_name} {author.last_name}
          </b>
          <div>
            <i>@{author.username}</i>
          </div>
        </div>
      </div>
    </div>
  );
}
