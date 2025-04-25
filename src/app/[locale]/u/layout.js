import Image from "next/image";
import Link from "next/link";
import { Icons } from "~/app/components/icons";
import { getI18nFromParams } from "~/app/i18n";
import { LogoutButton } from "~/app/components/atoms/logout-button";
import { PRIVATE_ROUTES } from "~/app/routes";
import styles from "./layout.module.css";

var I18N_NAMESPACES = ["common"];

export default async function AuthLayout({ params, children }) {
  var { t } = await getI18nFromParams(params)(I18N_NAMESPACES);

  return (
    <main className={styles.root}>
      <aside>
        <div>
          <Image
            src="/assets/logo.svg"
            alt="Jello"
            width={50}
            height={50}
          />
          <nav className={styles.links}>
            <Link
              className={styles.link}
              href={PRIVATE_ROUTES.profile()}
            >
              <Icons.User />
              {t("nav.profile")}
            </Link>
            <Link
              className={styles.link}
              href={PRIVATE_ROUTES.boards()}
            >
              <Icons.LayoutDashboard />
              {t("nav.boards")}
            </Link>
          </nav>
        </div>
        <LogoutButton className={styles.link}>
          {t("logout")}
        </LogoutButton>
      </aside>
      <div className={styles.content}>{children}</div>
    </main>
  );
}
