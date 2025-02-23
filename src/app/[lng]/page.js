import { getI18nFromParams } from "~/app/i18n";
import { NAMESPACES } from "~/app/i18n/config";

export default async function Home({ params }) {
  var { t } = await getI18nFromParams(params)(NAMESPACES.common);

  return <h1>{t("hello")}</h1>;
}
