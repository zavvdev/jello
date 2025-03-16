"use server";

import { query } from "~/app/utilities/query";
import { API_ROUTES } from "~/app/api/config";

export async function registerAction(_, formData) {
  try {
    var data = Object.fromEntries(formData);

    await query(API_ROUTES.auth.register(), "POST", {
      first_name: data.firstName,
      last_name: data.lastName,
      username: data.username,
      email: data.email,
      password: data.password,
      password_confirmation: data.confirmPassword,
    });

    return {
      success: true,
      message: undefined,
      extra: undefined,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      extra: error.response?.data,
    };
  }
}
