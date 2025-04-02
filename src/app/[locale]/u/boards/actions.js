"use server";

import { MESSAGES } from "jello-messages";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { API_ROUTES } from "~/app/api/config";
import { PRIVATE_ROUTES } from "~/app/routes";
import { query } from "~/app/utilities/query";

export async function toggleStarredBoard(_, { boardId, starred }) {
  if (starred) {
    await query(API_ROUTES.boards.unstar(boardId), "DELETE");
  } else {
    await query(API_ROUTES.boards.star(), "POST", {
      board_id: boardId,
    });
  }

  revalidatePath(PRIVATE_ROUTES.boards());
}

export async function deleteBoard(_, { boardId }) {
  await query(API_ROUTES.boards.delete(boardId), "DELETE");
  revalidatePath(PRIVATE_ROUTES.boards());
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
