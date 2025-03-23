import "server-only";

import { MESSAGES } from "jello-messages";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { APP_LOGOUT_URL } from "~/app/routes";

class QueryError extends Error {
  /**
   * @param {string} message
   * @param {(object | undefined)} response
   */
  constructor(message, response = {}) {
    super(message);
    this.name = "QueryError";
    this.response = response || {};
  }
}

/**
 * @param {string} route
 * @param {("GET" | "POST" | "PUT" | "PATCH" | "DELETE")?} method
 * @param {object?} body
 */
export async function query(route, method, body) {
  var cookieStore = await cookies();

  try {
    var token = cookieStore.get(process.env.AUTH_COOKIE_NAME)?.value;

    var res = await fetch(route, {
      method: method || "GET",
      body: body ? JSON.stringify(body) : undefined,
      headers: token
        ? {
            [process.env.API_AUTH_HEADER]: token,
          }
        : {},
    });

    var data = await res.json();

    if (data.success) {
      return data;
    } else {
      throw new QueryError(data.message, data);
    }
  } catch (e) {
    if (e.message === MESSAGES.unauthorized) {
      redirect(APP_LOGOUT_URL.full);
    } else if (e instanceof QueryError) {
      return e.response;
    } else {
      throw e;
    }
  }
}
