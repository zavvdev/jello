import { Either as E } from "jello-fp";

class CastModelError extends Error {
  /**
   * @param {string} name
   * @param {(object)} errors
   */
  constructor(name, errors) {
    super(`${name} model cast error.`);
    this.name = "CastModelError";
    this.errors = errors || {};
  }
}

export var castModel = (schema) => (name) => (data) => {
  try {
    return E.right(schema.validateSync(data, { strict: true }));
  } catch (e) {
    return E.left(
      new CastModelError(name, {
        [e.path]: e.message,
      }),
    );
  }
};
