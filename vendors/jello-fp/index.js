// ============================================================================

/*
 *
 * Essentials
 *
 */

// ============================================================================

/**
 * pipe :: ((a -> b), (x -> y), ..., (y -> z)) -> a -> z
 *
 * @template {unknown} T
 * @template {unknown} R
 * @param {Array<Function>} fns
 * @returns {(x: T) => T | R}
 */
export var pipe =
  (...fns) =>
  (x) =>
    fns.reduce((r, f) => f(r), x);

/**
 * compose :: ((y -> z), (x -> y),  ..., (a -> b)) -> a -> z
 *
 * @template {unknown} T
 * @template {unknown} R
 * @param {Array<Function>} fns
 * @returns {(x: T) => T | R}
 */
export var compose =
  (...fns) =>
  (x) =>
    fns.reduceRight((r, f) => f(r), x);

/**
 * curry :: ((a, b, ...) -> c) -> a -> b -> ... -> c
 *
 * @param {Function} fn
 * @returns {Function}
 */
export var curry = (fn) => {
  var arity = fn.length;

  return function result(...args) {
    if (args.length < arity) {
      return result.bind(null, ...args);
    }

    return fn.call(null, ...args);
  };
};

/**
 * identity :: x -> x
 *
 * @template {unknown} T
 * @param {T} x
 * @returns {T}
 */
export var identity = (x) => x;

// ============================================================================

/*
 *
 * Algebraic Structures
 *
 */

// ============================================================================

/**
 * Maybe
 */

export class Maybe {
  constructor(x) {
    this.$value = x;
  }

  static of(x) {
    return new Maybe(x);
  }

  get isNothing() {
    return this.$value === null || this.$value === undefined;
  }

  map(fn) {
    return this.isNothing ? this : Maybe.of(fn(this.$value));
  }

  chain(fn) {
    return this.map(fn).join();
  }

  orElse(fallback) {
    return this.isNothing ? Maybe.of(fallback) : this;
  }

  join() {
    return this.$value;
  }
}

/**
 * IO
 */

export class IO {
  constructor(fn) {
    this.unsafePerformIO = fn;
  }

  static of(fn) {
    return new IO(fn);
  }

  map(fn) {
    return new IO((...args) => fn(this.unsafePerformIO(...args)));
  }

  join() {
    return this.unsafePerformIO;
  }
}

/**
 * Task
 */

export class Task {
  constructor(fn) {
    this.runner = fn;
  }

  static of(fn) {
    return new Task(fn);
  }

  static wrap(x) {
    return Task.of(async () => x);
  }

  static run(...tasks) {
    return new Task(async (...args) => {
      if (tasks.length === 1) {
        return await tasks[0].runner(...args);
      } else {
        return await Promise.all(
          tasks.map((task) => task.runner(...args)),
        );
      }
    });
  }

  map(fn) {
    return new Task(async (...args) => {
      const result = await this.runner(...args);
      return fn(result);
    });
  }

  join() {
    return this.runner;
  }
}

/**
 * Either
 */

export class Either {
  constructor(x) {
    this.$value = x;
  }

  static right(x) {
    return new Right(x);
  }

  static async asyncRight(x) {
    return new Right(x);
  }

  static left(x) {
    return new Left(x);
  }

  static map(fn) {
    return (x) => (x?.isRight ? new Right(fn(x.join())) : x);
  }

  static chain(fn) {
    return (x) => (x?.isRight ? fn(x.join()) : x);
  }

  static chainAll(fn) {
    return (xs) =>
      xs.every((x) => x.isRight)
        ? fn(xs.map((x) => x.join()))
        : xs.find((x) => x.isLeft);
  }

  static mapLeft(fn) {
    return (x) => (x?.isLeft ? new Left(fn(x.join())) : x);
  }

  static chainLeft(fn) {
    return (x) => (x?.isLeft ? fn(x.join()) : x);
  }

  /**
   * @param {Left | Right} x
   * @returns {boolean}
   */
  static isLeft(x) {
    return Boolean(x?.isLeft);
  }

  /**
   * @param {Left | Right} x
   * @returns {boolean}
   */
  static isRight(x) {
    return Boolean(x?.isRight);
  }

  /**
   * @template {unknown} T
   * @param {Left | Right} x
   * @returns {T}
   */
  static join(x) {
    if (x?.isLeft || x?.isRight) {
      return x.join();
    }
    throw new Error("Not an Either type");
  }
}

class Left extends Either {
  get isLeft() {
    return true;
  }

  get isRight() {
    return false;
  }

  static of() {
    throw new Error(
      "`of` called on class Left (value) instead of Either (type)",
    );
  }

  map() {
    return this;
  }

  join() {
    return this.$value;
  }
}

class Right extends Either {
  get isLeft() {
    return false;
  }

  get isRight() {
    return true;
  }

  static of() {
    throw new Error(
      "`of` called on class Right (value) instead of Either (type)",
    );
  }

  map(fn) {
    return Either.right(fn(this.$value));
  }

  join() {
    return this.$value;
  }
}

/**
 * Match
 */

export class Match {
  constructor(x, m) {
    this.$value = x;
    this.$matched = m;
  }

  static of(x) {
    return new Match(x);
  }

  on(x, fn) {
    if (this.$value === x) {
      return new Match(fn(this.$value), true);
    }

    return this;
  }

  or(x) {
    if (!this.$matched) {
      return new Match(x);
    }

    return this;
  }

  join() {
    return this.$value;
  }
}

// ============================================================================

/*
 *
 * Pointfree Utilities
 *
 */

// ============================================================================

/**
 * head :: [a] -> a
 *
 * @template {unknown} T
 * @param {Array<T>} xs
 * @returns {T}
 */
export var head = (xs) => xs[0];

/**
 * safeHead :: [a] -> Maybe a
 *
 * @template {unknown} T
 * @param {Array<T>} xs
 * @returns {Maybe(T)}
 */
export var safeHead = (xs) => Maybe.of(xs[0]);

/**
 * last :: [a] -> a
 *
 * @template {unknown} T
 * @param {Array<T>} xs
 * @returns {T}
 */
export var last = (xs) => xs[xs.length - 1];

/**
 * safeLast :: [a] -> Maybe a
 *
 * @template {unknown} T
 * @param {Array<T>} xs
 * @returns {Maybe(T)}
 */
export var safeLast = (xs) => Maybe.of(xs[xs.length - 1]);

/**
 * map :: Functor f => (a -> b) -> f a -> f b
 *
 * @template {unknown} T
 * @template {unknown} R
 * @param {(v: T) => R} fn
 * @returns {(f: Array<T>) => Array<R>}
 */
export var map = (fn) => (f) => f.map(fn);

/**
 * prop :: String -> Object -> a
 *
 * @template {Object} T
 * @template {unknown} R
 * @param {string} k
 * @returns {(x: T) => R}
 */
export var prop = (k) => (x) => x[k];

/**
 * safeProp :: String -> Object -> Maybe a
 *
 * @template {Object} T
 * @template {unknown} R
 * @param {string} k
 * @returns {(x: T) => Maybe(R)}
 */
export var safeProp = (k) => (x) => Maybe.of(x[k]);

/**
 * not :: a -> Boolean
 *
 * @template {unknown} T
 * @param {T} x
 * @returns {boolean}
 */
export var not = (x) => !x;

/**
 * cond :: (a -> b), [(a -> Boolean, a -> b)], ... [(a -> Boolean, a -> b)] -> a -> b
 *
 * @template {unknown} F
 * @template {unknown} R
 * @template {unknown} T
 * @param {(T) => F} elseClause
 * @param {Array<[(T) => boolean, (x: T) => R]>} ifClauses
 * @retuns {(x: T) => F | R}
 */
export var cond =
  (elseClause, ...ifClauses) =>
  (x) =>
    ifClauses.find((ifClause) => ifClause[0](x))?.[1]?.(x) ||
    elseClause(x);

export var log = (label) => (x) => {
  // eslint-disable-next-line no-console
  console.log(label || "LOG:", x);
  return x;
};

export var mergeEach = (xs) =>
  xs.reduce((acc, x) => ({ ...acc, ...x }), {});

export var toEitherTask = (x) => Task.of(async () => Either.right(x));
