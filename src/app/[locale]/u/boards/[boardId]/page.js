import { removeEmptyValues } from "jello-utils";
import { User } from "~/core/entity/models/user";
import { I18nProvider } from "~/app/i18n/provider";
import { API_ROUTES } from "~/app/api/config";
import { query } from "~/app/utilities/query";
import { NAMESPACES } from "~/app/i18n/config";
import { getI18nFromParams } from "~/app/i18n";
import { Header } from "./_components/atoms/header";
import { Lists } from "./_components/atoms/lists";
import styles from "./page.module.css";
import { Filter } from "./_components/atoms/filter";

var I18N_NAMESPACES = [NAMESPACES.board];

var getBoard = async (boardId) => {
  var boardData = await query(
    API_ROUTES.boards.getOne(boardId),
    "GET",
    null,
    true,
  );
  return boardData?.data;
};

var getUsers = async (boardId) => {
  var boardUsers = await query(
    API_ROUTES.boards.getUsers(boardId),
    "GET",
    null,
    true,
  );
  return boardUsers?.data;
};

var getLabels = async (boardId) => {
  var boardLabels = await query(
    API_ROUTES.labels.getAll(boardId),
    "GET",
    null,
    true,
  );
  return boardLabels?.data || [];
};

var getLists = async (boardId, searchParams) => {
  var boardLists = await query(
    API_ROUTES.lists.getAll(boardId, removeEmptyValues(searchParams)),
    "GET",
    null,
    true,
  );
  return boardLists?.data || [];
};

export default async function Board({ params, searchParams }) {
  var { boardId } = await params;
  searchParams = await searchParams;

  var { t, i18n, resources } =
    await getI18nFromParams(params)(I18N_NAMESPACES);

  var board = await getBoard(boardId);
  var users = await getUsers(boardId);
  var labels = await getLabels(boardId);
  var lists = await getLists(boardId, searchParams);

  return (
    <I18nProvider
      namespaces={I18N_NAMESPACES}
      locale={i18n.language}
      resources={resources}
    >
      {!board && <p>{t("board_not_found")}</p>}
      {board && (
        <div className={styles.root}>
          <Header
            boardId={board.id}
            name={board.name}
            description={board.description}
            color={board.color}
            isFavourite={board.is_favorite}
            canEdit={User.canEditBoard(board.role)}
          />
          <Filter
            boardId={boardId}
            users={users}
            labels={labels}
            searchParams={searchParams}
          />
          <Lists
            boardId={board.id}
            role={board.role}
            data={lists}
            boardUsers={users}
            boardLabels={labels}
          />
        </div>
      )}
    </I18nProvider>
  );
}
