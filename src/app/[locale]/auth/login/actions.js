"use server";

import { cookies } from "next/headers";
import { errorReporterService } from "~/infra/services/error-reporter-service";
import { API_ROUTES } from "~/app/api/config";
import { query } from "~/app/utilities/query";

export async function loginAction(_, formData) {
  try {
    var payload = Object.fromEntries(formData);

    var { data } = await query(API_ROUTES.auth.login(), "POST", {
      usernameOrEmail: payload.usernameOrEmail,
      password: payload.password,
    });

    (await cookies()).set({
      name: process.env.AUTH_COOKIE_NAME,
      domain: process.env.AUTH_COOKIE_DOMAIN,
      value: data.token,
      httpOnly: true,
      secure: true,
      sameSite: "lax",
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
