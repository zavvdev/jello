export var applyMiddlewares =
  (data) =>
  (...middlewares) =>
  async (executor) => {
    var result = await Promise.all(
      middlewares.map((middleware) => middleware(data)),
    );
    return await executor(...result);
  };
