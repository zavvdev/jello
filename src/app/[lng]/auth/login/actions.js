"use server";

import { cookies } from "next/headers";
import { errorReporterService } from "~/infra/services/error-reporter-service";
import { login } from "~/domain/features/auth/login";
import { COOKIE_CONFIG } from "~/domain/features/auth/login/config";

export async function loginAction(_, formData) {
  try {
    var { usernameOrEmail, password } = Object.fromEntries(formData);

    var { token } = await login({
      usernameOrEmail,
      password,
    });

    var cookieStore = await cookies();
    cookieStore.set(COOKIE_CONFIG(token));

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
