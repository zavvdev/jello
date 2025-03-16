class CrashReportService {
  /**
   * @type {Console}
   */
  #repository;

  constructor(repo) {
    this.#repository = repo;
  }

  /**
   * @param {{
   *    message?: string;
   *    location?: string;
   *    error: any;
   * }} error
   */
  report(error) {
    var errorToReport = {
      message: error.message,
      location: error.location,
      error: error.error,
    };
    this.#repository.error(errorToReport);
  }
}

// Can be any external service that can report errors, like Sentry
export var crashReportService = new CrashReportService(console);
