import Link from "next/link";
import Image from "next/image";
import { I18nProvider } from "~/app/i18n/provider";
import { getI18nFromParams } from "~/app/i18n";
import { NAMESPACES } from "~/app/i18n/config";
import { PUBLIC_ROUTES } from "~/app/routes";
import { Form } from "./atoms/form";

var I18N_NAMESPACES = [NAMESPACES.login];

export default async function Login({ params }) {
  var { t, i18n, resources } = await getI18nFromParams(params)(I18N_NAMESPACES);

  return (
    <I18nProvider
      namespaces={I18N_NAMESPACES}
      locale={i18n.language}
      resources={resources}
    >
      <main>
        <Image src="/assets/logo.svg" alt="Jello" width={100} height={100} />
        <h1>{t("title")}</h1>
        <Form />
        <p>
          {t("register.text")}{" "}
          <Link href={PUBLIC_ROUTES.auth.register()}>{t("register.link")}</Link>
        </p>
      </main>
    </I18nProvider>
  );
}
