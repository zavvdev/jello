import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { API_AUTH_HEADER, API_MESSAGES, apiRoute } from "~/app/api/config";
import { PUBLIC_ROUTES } from "../routes";

class QueryError extends Error {
  /**
   * @param {string} message
   * @param {(object | undefined)} extra
   */
  constructor(message, extra = {}) {
    super(message);
    this.name = "QueryError";
    this.extra = extra || {};
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
    var res = await fetch(apiRoute(route), {
      method: method || "GET",
      body: body ? JSON.stringify(body) : undefined,
      headers: {
        [API_AUTH_HEADER]: cookieStore.get(process.env.COOKIE_NAME)?.value,
      },
    });

    var data = await res.json();

    if (data.success) {
      return data;
    } else {
      throw new QueryError(data.message, data);
    }
  } catch (e) {
    if (e.message === API_MESSAGES.unauthorized) {
      cookieStore.delete(process.env.COOKIE_NAME);
      redirect(PUBLIC_ROUTES.auth.login());
    }
    throw e;
  }
}
