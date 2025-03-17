import { API_ROUTES } from "~/app/api/config";
import { getI18nFromParams } from "~/app/i18n";
import { NAMESPACES } from "~/app/i18n/config";
import { query } from "~/app/utilities/query";

export default async function Dashboard({ params }) {
  var { t } = await getI18nFromParams(params)([NAMESPACES.common]);
  var boards = await query(API_ROUTES.boards.getStarred());

  return (
    <h1>
      {t("hello")}
      <ul>
        {boards?.data?.map((board) => (
          <li key={board.id}>
            {board.name}, {board.color}
          </li>
        ))}
      </ul>
    </h1>
  );
}
