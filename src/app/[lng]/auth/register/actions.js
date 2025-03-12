"use server";

import { errorReporterService } from "~/infra/services/error-reporter-service";
import { query } from "~/app/utilities/query";
import { API_ROUTES } from "~/app/api/config";

export async function registerAction(_, formData) {
  try {
    var data = Object.fromEntries(formData);

    if (data.password !== data.confirmPassword) {
      throw new Error("passwords_not_match");
    }

    await query(API_ROUTES.auth.register(), "POST", {
      first_name: data.firstName,
      last_name: data.lastName,
      username: data.username,
      email: data.email,
      password: data.password,
    });

    return {
      success: true,
      message: undefined,
      extra: undefined,
    };
  } catch (error) {
    errorReporterService.report({
      message: error.message,
      error,
    });
    return {
      success: false,
      message: error.message,
      extra: error.response?.data,
    };
  }
}
