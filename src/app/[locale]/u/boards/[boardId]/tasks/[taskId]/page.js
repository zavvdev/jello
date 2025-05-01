import Link from "next/link";
import { User } from "~/core/entity/models/user";
import { getI18nFromParams } from "~/app/i18n";
import { NAMESPACES } from "~/app/i18n/config";
import { I18nProvider } from "~/app/i18n/provider";
import { query } from "~/app/utilities/query";
import { API_ROUTES } from "~/app/api/config";
import { PRIVATE_ROUTES } from "~/app/routes";
import { Icons } from "~/app/components/icons";
import { FormBaseInfo } from "./_components/atoms/form-base-info";
import styles from "./page.module.css";

var I18N_NAMESPACES = [NAMESPACES.task];

async function getUser() {
  var user = await query(API_ROUTES.me.get());
  return user.data;
}

async function getBoard(id) {
  var board = await query(API_ROUTES.boards.getOne(id));
  return board.data;
}

async function getTask(id) {
  var task = await query(API_ROUTES.tasks.get(id));
  return task.data;
}

async function getLists(boardId) {
  var lists = await query(API_ROUTES.lists.getAll(boardId));
  return lists.data;
}

export default async function Task({ params }) {
  var { boardId, taskId } = await params;

  var user = await getUser();
  var board = await getBoard(boardId);
  var task = await getTask(taskId);
  var lists = await getLists(boardId);

  var { t, i18n, resources } =
    await getI18nFromParams(params)(I18N_NAMESPACES);

  return (
    <I18nProvider
      namespaces={I18N_NAMESPACES}
      locale={i18n.language}
      resources={resources}
    >
      <div>
        <Link
          href={PRIVATE_ROUTES.board(boardId)}
          className={styles.back}
        >
          <Icons.ArrowLeft width="1.2rem" />
          {t("back_to_board")}
        </Link>
        <FormBaseInfo
          boardId={boardId}
          taskId={taskId}
          canDelete={User.canDeleteTask({
            userId: user.id,
            taskCreatorId: task.created_by,
          })(board.role)}
          lists={lists}
          initialValues={{
            name: task.name,
            description: task.description,
            listId: task.list_id,
          }}
        />
        <hr />
      </div>
    </I18nProvider>
  );
}
