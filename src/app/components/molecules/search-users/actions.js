"use server";

import { API_ROUTES } from "~/app/api/config";
import { query } from "~/app/utilities/query";

export async function searchUsers(_, { username }) {
  if (!username) return [];
  var data = await query(API_ROUTES.users.search(username));
  return data?.data || [];
}
