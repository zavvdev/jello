import "server-only";

import bcrypt from "bcrypt";

/**
 * @param {string} input
 */
export function hashPassword(input) {
  return bcrypt.hash(input, 10);
}

/**
 * @param {string} target
 * @param {string} hashedTarget
 */
export function comparePasswords(target, hashedTarget) {
  return bcrypt.compare(target, hashedTarget);
}
