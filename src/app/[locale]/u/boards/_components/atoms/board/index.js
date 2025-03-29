import cx from "clsx";
import Link from "next/link";
import { Icons } from "~/app/components/icons";
import { PRIVATE_ROUTES } from "~/app/routes";
import styles from "./styles.module.css";
import { StarButton } from "./_components/atoms/star-button";

export function Board({
  t,
  id,
  name,
  color,
  description,
  isFavorite,
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
        <Link
          className={styles.footerBtn}
          href={PRIVATE_ROUTES.editBoard(id)}
        >
          <Icons.Pencil />
        </Link>
        <button className={cx(styles.footerBtn, styles.btnDelete)}>
          <Icons.Trash />
        </button>
      </div>
    </div>
  );
}
