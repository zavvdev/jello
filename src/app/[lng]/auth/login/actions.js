"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { errorReporterService } from "~/infra/services/error-reporter-service";
import { login } from "~/domain/features/auth/login";
import { COOKIE_CONFIG } from "~/domain/features/auth/login/config";
import { PRIVATE_ROUTES } from "~/app/routes";

export async function loginAction(_, formData) {
  try {
    var { usernameOrEmail, password } = Object.fromEntries(formData);

    var { token } = await login({
      usernameOrEmail,
      password,
    });

    var cookieStore = await cookies();
    cookieStore.set(COOKIE_CONFIG(token));

    // TODO: Doesn't work
    redirect(PRIVATE_ROUTES.dashboard());
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
