import { cookies } from "next/headers";
import { API_AUTH_HEADER, API_ROUTES, apiRoute } from "~/app/api/config";
import { getI18nFromParams } from "~/app/i18n";
import { NAMESPACES } from "~/app/i18n/config";

export default async function Dashboard({ params }) {
  var { t } = await getI18nFromParams(params)(NAMESPACES.common);
  var res = await fetch(apiRoute(API_ROUTES.boards.getActive()), {
    headers: {
      [API_AUTH_HEADER]: (await cookies()).get(process.env.COOKIE_NAME)?.value,
    },
  });
  var boards = await res.json();

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
