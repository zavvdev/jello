import Link from "next/link";
import { getI18nFromParams } from "~/app/i18n";
import { NAMESPACES } from "~/app/i18n/config";
import { PRIVATE_ROUTES } from "~/app/routes";
import { Icons } from "~/app/components/icons";
import { Starred } from "./starred";
import styles from "./page.module.css";

export default async function Boards({ params }) {
  var { t } = await getI18nFromParams(params)([NAMESPACES.boards]);

  return (
    <div>
      <div className={styles.header}>
        <h1>{t("title")}</h1>
        <Link
          className={styles.createBoard}
          href={PRIVATE_ROUTES.createBoard()}
        >
          <Icons.SquarePlus />
        </Link>
      </div>
      <Starred t={t} />
    </div>
  );
}
