import "server-only";

import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

class EncryptionService {
  /**
   * @returns {string}
   */
  getUniqueId() {
    return uuidv4();
  }

  /**
   * @param {string} input
   * @returns {Promise<string>}
   */
  hash(input) {
    return bcrypt.hash(input, 10);
  }

  /**
   * @param {string} target
   * @param {string} hashedTarget
   * @returns {Promise<boolean>}
   */
  compareHashes(target, hashedTarget) {
    return bcrypt.compare(target, hashedTarget);
  }
}

export var encryptionService = new EncryptionService();
