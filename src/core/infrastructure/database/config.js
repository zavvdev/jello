import { MESSAGES } from "jello-messages";

export var CONNECTION = {
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
};

export var SORT_ORDER = {
  asc: "ASC",
  desc: "DESC",
};

export var MESSAGE_BY_CONSTRAINT = {
  users: {
    users_username_key: MESSAGES.usernameExists,
    users_email_key: MESSAGES.emailExists,
  },
};
