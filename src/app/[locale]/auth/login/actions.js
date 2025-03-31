"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { API_ROUTES } from "~/app/api/config";
import { PRIVATE_ROUTES } from "~/app/routes";
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
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  redirect(PRIVATE_ROUTES.boards());
}
