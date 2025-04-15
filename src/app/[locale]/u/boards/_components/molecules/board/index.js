import Link from "next/link";
import { Icons } from "~/app/components/icons";
import { PRIVATE_ROUTES } from "~/app/routes";
import styles from "./styles.module.css";
import { DeleteButton } from "./_components/atoms/delete-button";
import { StarButton } from "../../atoms/star-button";

export function Board({
  t,
  id,
  name,
  color,
  description,
  isFavorite,
  canDelete,
  canEdit,
}) {
  return (
    <div className={styles.root}>
      <div>
        <div className={styles.header}>
          <div
            className={styles.color}
            style={{ backgroundColor: color }}
          />
          <h3>{name}</h3>
          <StarButton boardId={id} starred={isFavorite} />
        </div>
        {description && <p>{description}</p>}
      </div>
      <div className={styles.footer}>
        <Link
          className={styles.footerBtn}
          href={PRIVATE_ROUTES.board(id)}
        >
          {t("open")}
        </Link>
        {canEdit && (
          <Link
            className={styles.footerBtn}
            href={PRIVATE_ROUTES.editBoard(id)}
          >
            <Icons.Pencil />
          </Link>
        )}
        {canDelete && (
          <DeleteButton
            confirmMessage={t("confirm.delete")}
            boardId={id}
            className={styles.footerBtn}
          />
        )}
      </div>
    </div>
  );
}
