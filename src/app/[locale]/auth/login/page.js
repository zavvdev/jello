import Link from "next/link";
import { I18nProvider } from "~/app/i18n/provider";
import { getI18nFromParams } from "~/app/i18n";
import { NAMESPACES } from "~/app/i18n/config";
import { PUBLIC_ROUTES } from "~/app/routes";
import { LoginForm } from "~/app/components/molecules/login-form";
import { AuthHeader } from "~/app/components/atoms/auth-header";
import styles from "./page.module.css";

var I18N_NAMESPACES = [NAMESPACES.login];

export default async function Login({ params }) {
  var { t, i18n, resources } = await getI18nFromParams(params)(I18N_NAMESPACES);

  return (
    <I18nProvider
      namespaces={I18N_NAMESPACES}
      locale={i18n.language}
      resources={resources}
    >
      <main className={styles.root}>
        <AuthHeader title={t("title")} />
        <LoginForm />
        <p>
          {t("register.text")}{" "}
          <Link href={PUBLIC_ROUTES.auth.register()}>{t("register.link")}</Link>
        </p>
      </main>
    </I18nProvider>
  );
}
