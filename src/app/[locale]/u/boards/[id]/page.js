import { User } from "~/core/entity/models/user";
import { I18nProvider } from "~/app/i18n/provider";
import { API_ROUTES } from "~/app/api/config";
import { query } from "~/app/utilities/query";
import { NAMESPACES } from "~/app/i18n/config";
import { getI18nFromParams } from "~/app/i18n";
import { Header } from "./_components/atoms/header";
import { Lists } from "./_components/atoms/lists";
import styles from "./page.module.css";

var I18N_NAMESPACES = [NAMESPACES.board];

export default async function Board({ params }) {
  var { id } = await params;

  var { i18n, resources } =
    await getI18nFromParams(params)(I18N_NAMESPACES);

  var boardData = await query(API_ROUTES.boards.getOne(id));
  var board = boardData?.data || {};

  var listsData = await query(API_ROUTES.lists.getAll(id));
  var lists = listsData?.data || [];

  return (
    <I18nProvider
      namespaces={I18N_NAMESPACES}
      locale={i18n.language}
      resources={resources}
    >
      <div className={styles.root}>
        <Header
          id={board.id}
          name={board.name}
          description={board.description}
          color={board.color}
          isFavourite={board.is_favorite}
          canEdit={User.canEditBoard(board.role)}
        />
        <Lists data={lists} />
      </div>
    </I18nProvider>
  );
}
