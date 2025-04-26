import Link from "next/link";
import { StarButton } from "~/app/[locale]/u/boards/_components/atoms/star-button";
import { PRIVATE_ROUTES } from "~/app/routes";
import { Icons } from "~/app/components/icons";
import styles from "./styles.module.css";

export function Header({
  boardId,
  name,
  description,
  color,
  isFavourite,
  canEdit,
}) {
  return (
    <div className={styles.root}>
      <div className={styles.inner}>
        <div className={styles.color} style={{ background: color }} />
        <h2>{name}</h2>
        <StarButton boardId={boardId} starred={isFavourite} />
        {canEdit && (
          <Link
            className={styles.edit}
            href={PRIVATE_ROUTES.editBoard(boardId)}
          >
            <Icons.Pencil width="1rem" />
          </Link>
        )}
      </div>
      {description && <p>{description}</p>}
    </div>
  );
}
