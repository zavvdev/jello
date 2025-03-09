import { boardsRepo } from "~/infra/repositories/private/boards";
import { getI18nFromParams } from "~/app/i18n";
import { NAMESPACES } from "~/app/i18n/config";

export default async function Dashboard({ params }) {
  var { t } = await getI18nFromParams(params)(NAMESPACES.common);
  var boards = await boardsRepo.getAll();

  return (
    <h1>
      {t("hello")}
      <ul>
        {boards.map((board) => (
          <li key={board.id}>
            {board.name}, {board.color}
          </li>
        ))}
      </ul>
    </h1>
  );
}
