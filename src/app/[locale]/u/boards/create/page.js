import { I18nProvider } from "~/app/i18n/provider";
import { Button } from "~/app/components/atoms/button";
import { getI18nFromParams } from "~/app/i18n";
import { NAMESPACES } from "~/app/i18n/config";
import { MutateBoardForm } from "../_components/molecules/mutate-board-form";
import { createBoard } from "../actions";

var I18N_NAMESPACES = [NAMESPACES.createBoard, NAMESPACES.boards];

export default async function CreateBoard({ params }) {
  var { t, i18n, resources } =
    await getI18nFromParams(params)(I18N_NAMESPACES);

  return (
    <I18nProvider
      namespaces={I18N_NAMESPACES}
      locale={i18n.language}
      resources={resources}
    >
      <form action={createBoard}>
        <h1>{t("title")}</h1>
        <MutateBoardForm />
        <Button>{t("submit")}</Button>
      </form>
    </I18nProvider>
  );
}
