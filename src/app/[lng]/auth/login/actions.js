"use server";

import { errorReporterService } from "~/infra/services/error-reporter-service";
import { login } from "~/domain/features/auth/login";

export async function loginAction(_, formData) {
  try {
    var { usernameOrEmail, password } = Object.fromEntries(formData);

    await login({
      usernameOrEmail,
      password,
    });

    return {
      success: true,
      message: undefined,
    };
  } catch (error) {
    errorReporterService.report({
      message: error.message,
      error,
    });
    return {
      success: false,
      message: error.message,
    };
  }
}
