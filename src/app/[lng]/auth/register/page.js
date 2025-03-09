import Link from "next/link";
import Image from "next/image";
import { getI18nFromParams } from "~/app/i18n";
import { NAMESPACES } from "~/app/i18n/config";
import { PUBLIC_ROUTES } from "~/app/routes";
import { Form } from "./atoms/form";

export default async function Register({ params }) {
  var { t } = await getI18nFromParams(params)(NAMESPACES.auth);

  return (
    <main>
      <Image src="/assets/logo.svg" alt="Jello" width={100} height={100} />
      <h1>{t("register.title")}</h1>
      <p>{t("register.subtitle")}</p>
      <Form />
      <p>
        {t("register.login.text")}{" "}
        <Link href={PUBLIC_ROUTES.auth.login()}>
          {t("register.login.link")}
        </Link>
      </p>
    </main>
  );
}
