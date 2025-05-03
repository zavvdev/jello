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
import { FormAssignedUsers } from "./_components/atoms/form-assigned-users";
import { FormAssignedLabels } from "./_components/atoms/form-assigned-labels";
import { FormComments } from "./_components/atoms/form-comments";

var I18N_NAMESPACES = [NAMESPACES.task];

async function getUser() {
  var user = await query(API_ROUTES.me.get());
  return user.data;
}

async function getBoard(id) {
  var board = await query(
    API_ROUTES.boards.getOne(id),
    "GET",
    null,
    true,
  );
  return board.data;
}

async function getTask(id) {
  var task = await query(API_ROUTES.tasks.get(id), "GET", null, true);
  return task.data;
}

async function getLists(boardId) {
  var lists = await query(
    API_ROUTES.lists.getAll(boardId),
    "GET",
    null,
    true,
  );
  return lists.data;
}

async function getBoardUsers(boardId) {
  var users = await query(
    API_ROUTES.boards.getUsers(boardId),
    "GET",
    null,
    true,
  );
  return users.data || [];
}

async function getTaskUsers(taskId) {
  var users = await query(
    API_ROUTES.tasks.getUsers(taskId),
    "GET",
    null,
    true,
  );
  return users.data || [];
}

async function getBoardLabels(boardId) {
  var users = await query(
    API_ROUTES.labels.getAll(boardId),
    "GET",
    null,
    true,
  );
  return users.data || [];
}

async function getTaskLabels(taskId) {
  var users = await query(
    API_ROUTES.tasks.getLabels(taskId),
    "GET",
    null,
    true,
  );
  return users.data || [];
}

async function getComments(taskId) {
  var users = await query(
    API_ROUTES.tasks.getComments(taskId),
    "GET",
    null,
    true,
  );
  return users.data || [];
}

export default async function Task({ params }) {
  var { boardId, taskId } = await params;

  var user = await getUser();
  var board = await getBoard(boardId);
  var task = await getTask(taskId);
  var lists = await getLists(boardId);
  var boardUsers = await getBoardUsers(boardId);
  var taskUsers = await getTaskUsers(taskId);
  var boardLabels = await getBoardLabels(boardId);
  var taskLabels = await getTaskLabels(taskId);
  var comments = await getComments(taskId);

  var { t, i18n, resources } =
    await getI18nFromParams(params)(I18N_NAMESPACES);

  return (
    <I18nProvider
      namespaces={I18N_NAMESPACES}
      locale={i18n.language}
      resources={resources}
    >
      {!board && <p>{t("board_not_found")}</p>}
      {!task && <p>{t("task_not_found")}</p>}
      {board && task && (
        <div className={styles.root}>
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
          <br />
          <hr />
          <br />
          <FormAssignedUsers
            taskId={taskId}
            boardUsers={boardUsers}
            taskUsers={taskUsers}
          />
          <br />
          <hr />
          <br />
          <FormAssignedLabels
            taskId={taskId}
            boardLabels={boardLabels}
            taskLabels={taskLabels}
          />
          <FormComments
            userId={user.id}
            taskId={taskId}
            boardId={boardId}
            comments={comments}
          />
        </div>
      )}
    </I18nProvider>
  );
}
