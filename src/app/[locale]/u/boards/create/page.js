import { getI18nFromParams } from "~/app/i18n";
import { NAMESPACES } from "~/app/i18n/config";
import { MutateBoardForm } from "../_components/molecules/mutate-board-form";

export default async function CreateBoard({ params }) {
  var { t } = await getI18nFromParams(params)([
    NAMESPACES.createBoard,
    NAMESPACES.boards,
  ]);

  return (
    <div>
      <h1>{t("title")}</h1>
      <MutateBoardForm
        t={(key) => t(`${NAMESPACES.boards}:mutate_form.${key}`)}
      />
    </div>
  );
}
