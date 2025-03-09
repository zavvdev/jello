import "server-only";

import bcrypt from "bcrypt";
import { PASSWORD_HASH_SALT_ROUNDS } from "~/infra/encryption/config";

/**
 * @param {string} input
 */
export function hashPassword(input) {
  return bcrypt.hash(input, PASSWORD_HASH_SALT_ROUNDS);
}

/**
 * @param {string} target
 * @param {string} hashedTarget
 */
export function comparePasswords(target, hashedTarget) {
  return bcrypt.compare(target, hashedTarget);
}
