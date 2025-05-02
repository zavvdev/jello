"use server";

import { MESSAGES } from "jello-messages";
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

export async function updateTask(_, formData) {
  try {
    await query(API_ROUTES.tasks.update(formData.get("id")), "PUT", {
      name: formData.get("name"),
      description: formData.get("description"),
      list_id: parseInt(formData.get("listId")),
    });

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

export async function assignUser(_, formData) {
  try {
    await query(
      API_ROUTES.tasks.assignUser(formData.get("taskId")),
      "POST",
      {
        user_id: parseInt(formData.get("userId")),
      },
    );

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

export async function removeUser(_, formData) {
  try {
    await query(
      API_ROUTES.tasks.removeUser(
        formData.get("taskId"),
        formData.get("userId"),
      ),
      "DELETE",
    );

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

export async function assignLabel(_, formData) {
  try {
    await query(
      API_ROUTES.tasks.assignLabel(formData.get("taskId")),
      "POST",
      {
        label_id: parseInt(formData.get("labelId")),
      },
    );

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

export async function removeLabel(_, formData) {
  try {
    await query(
      API_ROUTES.tasks.removeLabel(
        formData.get("taskId"),
        formData.get("labelId"),
      ),
      "DELETE",
    );

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
