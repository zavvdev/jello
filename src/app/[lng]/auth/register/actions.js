"use server";

import { errorReporterService } from "~/infra/services/error-reporter-service";
import { register } from "~/domain/features/auth/register";

export async function registerAction(_, formData) {
  try {
    var data = Object.fromEntries(formData);

    if (data.password !== data.confirmPassword) {
      throw new Error("passwords_not_match");
    }

    await register({
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
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
