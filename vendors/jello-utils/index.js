export class MiddlewareError extends Error {
  /**
   * @param {string} message
   * @param {(object | undefined)} response
   */
  constructor(message, payload = {}) {
    super(message);
    this.name = "MiddlewareError";
    this.payload = payload || {};
  }
}

export var applyMiddlewares =
  (data) =>
  (...middlewares) =>
  async (executor) => {
    try {
      var result = await Promise.all(
        middlewares.map((middleware) => middleware(data)),
      );
      return await executor(...result);
    } catch (error) {
      if (error instanceof MiddlewareError) {
        return error.payload;
      }
      throw error;
    }
  };
