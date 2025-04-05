import { User, UserRole } from "~/core/entity/models/user";
import { API_ROUTES } from "~/app/api/config";
import { getI18nFromParams } from "~/app/i18n";
import { NAMESPACES } from "~/app/i18n/config";
import { query } from "~/app/utilities/query";
import { Alert } from "~/app/components/atoms/error";
import { I18nProvider } from "~/app/i18n/provider";
import { MutateBoardForm } from "../../_components/molecules/mutate-board-form";

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
      />
    </I18nProvider>
  );
}
