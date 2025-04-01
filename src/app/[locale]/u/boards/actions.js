"use server";

import { revalidatePath } from "next/cache";
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

export async function createBoard(formData) {
  // eslint-disable-next-line no-console
  console.log(formData.getAll("assigned_users[]")?.map(JSON.parse));
  return null;
}
