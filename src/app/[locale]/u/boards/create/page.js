import { I18nProvider } from "~/app/i18n/provider";
import { getI18nFromParams } from "~/app/i18n";
import { NAMESPACES } from "~/app/i18n/config";
import { MutateBoardForm } from "../_components/molecules/mutate-board-form";

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
      <MutateBoardForm
        type="create"
        title={t("title")}
        submitText={t("submit")}
      />
    </I18nProvider>
  );
}
