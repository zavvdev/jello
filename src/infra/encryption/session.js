import "server-only";

import { v4 as uuidv4 } from "uuid";

export function createSessionToken() {
  return uuidv4();
}
