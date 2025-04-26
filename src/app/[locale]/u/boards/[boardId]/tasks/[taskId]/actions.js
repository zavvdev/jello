"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { API_ROUTES } from "~/app/api/config";
import { PRIVATE_ROUTES } from "~/app/routes";
import { query } from "~/app/utilities/query";

export async function deleteTask(_, { boardId, taskId }) {
  var res = await query(
    API_ROUTES.tasks.delete(taskId),
    "DELETE",
    null,
    true,
  );

  if (res.success) {
    revalidatePath(PRIVATE_ROUTES.board(boardId));
    redirect(PRIVATE_ROUTES.board(boardId));
  }

  return res;
}
