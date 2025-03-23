import Link from "next/link";
import { getI18nFromParams } from "~/app/i18n";
import { NAMESPACES } from "~/app/i18n/config";
import { I18nProvider } from "~/app/i18n/provider";
import { PUBLIC_ROUTES } from "~/app/routes";
import styles from "~/app/[locale]/auth/register/page.module.css";
import { Form } from "./_components/atoms/form";
import { Header } from "../_components/atoms/header";

var I18N_NAMESPACES = [NAMESPACES.register];

export default async function Register({ params }) {
  var { t, i18n, resources } =
    await getI18nFromParams(params)(I18N_NAMESPACES);

  return (
    <I18nProvider
      namespaces={I18N_NAMESPACES}
      locale={i18n.language}
      resources={resources}
    >
      <main className={styles.root}>
        <Header title={t("title")} subtitle={t("subtitle")} />
        <Form />
        <p>
          {t("login.text")}{" "}
          <Link href={PUBLIC_ROUTES.auth.login()}>
            {t("login.link")}
          </Link>
        </p>
      </main>
    </I18nProvider>
  );
}
