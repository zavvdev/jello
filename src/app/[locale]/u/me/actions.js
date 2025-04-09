"use server";

import { MESSAGES } from "jello-messages";
import { API_ROUTES } from "~/app/api/config";
import { query } from "~/app/utilities/query";

export async function updateProfile(_, formData) {
  try {
    await query(API_ROUTES.me.update(), "PUT", {
      first_name: formData.get("firstName"),
      last_name: formData.get("lastName"),
      username: formData.get("username"),
      email: formData.get("email"),
      bio: formData.get("bio"),
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
