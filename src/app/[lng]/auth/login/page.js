import Link from "next/link";
import Image from "next/image";
import { getI18nFromParams } from "~/app/i18n";
import { NAMESPACES } from "~/app/i18n/config";
import { PUBLIC_ROUTES } from "~/app/routes";
import { Form } from "./atoms/form";

export default async function Login({ params }) {
  var { t } = await getI18nFromParams(params)(NAMESPACES.auth);

  return (
    <main>
      <Image src="/static/logo.svg" alt="Jello" width={100} height={100} />
      <h1>{t("login.title")}</h1>
      <Form />
      <p>
        {t("login.register.text")}{" "}
        <Link href={PUBLIC_ROUTES.auth.register()}>
          {t("login.register.link")}
        </Link>
      </p>
    </main>
  );
}
