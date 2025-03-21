import Image from "next/image";
import Link from "next/link";
import { Icons } from "~/app/components/icons";
import { getI18nFromParams } from "~/app/i18n";
import { APP_LOGOUT_URL, PRIVATE_ROUTES } from "~/app/routes";
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
              href={PRIVATE_ROUTES.boards()}
            >
              <Icons.LayoutDashboard />
              {t("nav.boards")}
            </Link>
          </nav>
        </div>
        <form action={APP_LOGOUT_URL.base} method="GET">
          <input
            type="hidden"
            name={APP_LOGOUT_URL.queryName}
            value={APP_LOGOUT_URL.redirectUrl}
          />
          <button className={styles.link} type="submit">
            <Icons.Logout />
            {t("logout")}
          </button>
        </form>
      </aside>
      <div className={styles.content}>{children}</div>
    </main>
  );
}
