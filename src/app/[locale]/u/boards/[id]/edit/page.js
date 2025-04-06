import { User, UserRole } from "~/core/entity/models/user";
import { API_ROUTES } from "~/app/api/config";
import { getI18nFromParams } from "~/app/i18n";
import { NAMESPACES } from "~/app/i18n/config";
import { query } from "~/app/utilities/query";
import { Alert } from "~/app/components/atoms/error";
import { I18nProvider } from "~/app/i18n/provider";
import { MutateBoardForm } from "../../_components/molecules/mutate-board-form";
import { ArchiveButton } from "./_components/atoms/archive-button";
import styles from "./styles.module.css";
import { DeleteButton } from "./_components/atoms/delete-button";

var I18N_NAMESPACES = [NAMESPACES.editBoard, NAMESPACES.boards];
var notOwner = (x) => x.role !== UserRole.Owner;

export default async function EditBoard({ params }) {
  var { id } = await params;

  var boardResponse = await query(
    API_ROUTES.boards.getOne(id),
    "GET",
    null,
    true,
  );

  var board = boardResponse?.data;

  var labelsResponse = await query(
    API_ROUTES.labels.getAll(id),
    "GET",
    null,
    true,
  );

  var labels = labelsResponse?.data || [];

  var usersResponse = await query(
    API_ROUTES.boards.getUsers(id),
    "GET",
    null,
    true,
  );

  var users = usersResponse?.data?.filter(notOwner) || [];

  var { t, i18n, resources } =
    await getI18nFromParams(params)(I18N_NAMESPACES);

  if (!board) {
    return <Alert type="error">{t("not_found")}</Alert>;
  }

  if (!User.canEditBoard(board.role)) {
    return <Alert type="error">{t("cannot_edit")}</Alert>;
  }

  return (
    <I18nProvider
      namespaces={I18N_NAMESPACES}
      locale={i18n.language}
      resources={resources}
    >
      <MutateBoardForm
        type="update"
        title={t("title")}
        submitText={t("submit")}
        initialValues={{
          id: Number(id),
          name: board.name,
          description: board.description,
          color: board.color,
          assignedUsers: users,
          labels,
        }}
        footer={
          <div className={styles.footer}>
            {User.canArchiveBoard(board.role) && (
              <ArchiveButton
                boardId={board.id}
                isArchived={board.is_archived}
                confirmMessage={
                  board.is_archived
                    ? t("confirm.activate")
                    : t("confirm.archive")
                }
              >
                {board.is_archived ? t("activate") : t("archive")}
              </ArchiveButton>
            )}
            {User.canDeleteBoard(board.role) && (
              <DeleteButton
                boardId={board.id}
                confirmMessage={t("confirm.delete")}
              >
                {t("delete")}
              </DeleteButton>
            )}
          </div>
        }
      />
    </I18nProvider>
  );
}
