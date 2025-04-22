"use server";

import { MESSAGES } from "jello-messages";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { API_ROUTES } from "~/app/api/config";
import { PRIVATE_ROUTES } from "~/app/routes";
import { query } from "~/app/utilities/query";
import { NewLabelId } from "./_components/molecules/mutate-board-form/_components/atoms/labels/utilities";

export async function toggleStarredBoard(_, { boardId, starred }) {
  if (starred) {
    await query(API_ROUTES.boards.unstar(boardId), "DELETE");
  } else {
    await query(API_ROUTES.boards.star(), "POST", {
      board_id: boardId,
    });
  }

  revalidatePath(PRIVATE_ROUTES.boards());
  revalidatePath(PRIVATE_ROUTES.board(boardId));
}

export async function deleteBoard(_, { boardId, redirectToBoards }) {
  await query(API_ROUTES.boards.delete(boardId), "DELETE");
  revalidatePath(PRIVATE_ROUTES.boards());
  if (redirectToBoards) {
    redirect(PRIVATE_ROUTES.boards());
  }
}

export async function createBoard(_, formData) {
  var createdBoardId;

  try {
    var name = formData.get("name");
    var description = formData.get("description");
    var color = formData.get("color");

    var assignedUsers =
      formData.getAll("assigned_users[]")?.map(JSON.parse) || [];

    var labels = formData.getAll("labels[]")?.map(JSON.parse) || [];

    var result = await query(API_ROUTES.boards.create(), "POST", {
      name,
      description,
      color,
      assigned_users: assignedUsers,
      labels: labels.map((x) => ({
        name: x.name,
        color: x.color,
      })),
    });

    createdBoardId = result?.data?.board_id;

    if (!createdBoardId) {
      throw new Error();
    }
  } catch (error) {
    return {
      success: false,
      message: error.message || MESSAGES.unexpectedError,
      extra: error.response?.data,
    };
  }

  revalidatePath(PRIVATE_ROUTES.boards());
  redirect(PRIVATE_ROUTES.board(createdBoardId));
}

export async function updateBoard(_, formData) {
  try {
    var id = formData.get("id");
    var name = formData.get("name");
    var description = formData.get("description");
    var color = formData.get("color");

    var assignedUsers =
      formData.getAll("assigned_users[]")?.map(JSON.parse) || [];

    var labels = formData.getAll("labels[]")?.map(JSON.parse) || [];

    var result = await query(API_ROUTES.boards.update(id), "PUT", {
      name,
      description,
      color,
      assigned_users: assignedUsers,
      labels: labels.map((x) => ({
        id: NewLabelId.match(x.id) ? null : x.id,
        name: x.name,
        color: x.color,
      })),
    });

    revalidatePath(PRIVATE_ROUTES.boards());
    revalidatePath(PRIVATE_ROUTES.board(id));

    return {
      success: true,
      message: result.message,
      extra: null,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || MESSAGES.unexpectedError,
      extra: error.response?.data,
    };
  }
}

export async function toggleArchiveBoard(_, { boardId, isArchived }) {
  if (isArchived) {
    await query(API_ROUTES.boards.activate(boardId), "POST");
  } else {
    await query(API_ROUTES.boards.archive(boardId), "POST");
  }
  revalidatePath(PRIVATE_ROUTES.board(boardId));
  revalidatePath(PRIVATE_ROUTES.boards());
  redirect(PRIVATE_ROUTES.boards());
}

export async function mutateList(_, formData) {
  var boardId = formData.get("boardId");
  var id = formData.get("id");
  var name = formData.get("name");

  try {
    if (id) {
      await query(API_ROUTES.lists.update(id), "PATCH", {
        board_id: Number(boardId),
        name,
      });
    } else {
      await query(API_ROUTES.lists.create(), "POST", {
        board_id: Number(boardId),
        name,
      });
    }
    revalidatePath(PRIVATE_ROUTES.board(boardId));
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || MESSAGES.unexpectedError,
      extra: error.response?.data,
    };
  }
}

export async function deleteList(_, { boardId, id }) {
  await query(API_ROUTES.lists.delete(id, boardId), "DELETE");
  revalidatePath(PRIVATE_ROUTES.board(boardId));
}

export async function reorderList({ boardId, listIds }) {
  await query(API_ROUTES.lists.reorder(), "PUT", {
    board_id: boardId,
    lists_order: listIds.map(Number),
  });
}

export async function createTask(_, formData) {
  try {
    var boardId = formData.get("boardId");
    var listId = formData.get("listId");
    var name = formData.get("name");
    var description = formData.get("description");

    var assignedUsers =
      formData.getAll("assigned_users[]")?.map(JSON.parse) || [];

    var assignedLabels =
      formData.getAll("assigned_labels[]")?.map(JSON.parse) || [];

    await query(API_ROUTES.tasks.create(), "POST", {
      board_id: Number(boardId),
      list_id: Number(listId),
      name,
      description,
      assigned_users: assignedUsers.map((x) => ({ id: x.id })),
      assigned_labels: assignedLabels.map((x) => ({ id: x.id })),
    });

    revalidatePath(PRIVATE_ROUTES.board(boardId));

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || MESSAGES.unexpectedError,
      extra: error.response?.data,
    };
  }
}
