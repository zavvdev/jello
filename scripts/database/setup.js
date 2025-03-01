var db = require("./index");
var { color, username, email } = require("./validations");

function clear() {
  return db.transaction(async (client) => {
    await client.query(`
      DROP TRIGGER IF EXISTS update_users_updated_at ON users;
      DROP TRIGGER IF EXISTS update_boards_updated_at ON boards;
      DROP TRIGGER IF EXISTS update_labels_updated_at ON labels;
      DROP TRIGGER IF EXISTS update_lists_updated_at ON lists;
      DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
      DROP TRIGGER IF EXISTS update_task_comments_updated_at ON task_comments;

      DROP FUNCTION IF EXISTS update_updated_at();

      DROP TABLE IF EXISTS users_boards_roles;
      DROP TABLE IF EXISTS tasks_labels;
      DROP TABLE IF EXISTS task_comments;
      DROP TABLE IF EXISTS users;
      DROP TABLE IF EXISTS labels;
      DROP TABLE IF EXISTS tasks;
      DROP TABLE IF EXISTS lists;
      DROP TABLE IF EXISTS boards;

      DROP TYPE IF EXISTS user_board_role;
    `);
  });
}

function migrate() {
  return db.transaction(async (client) => {
    // ====================
    // Types
    // ====================

    await client.query(`
      CREATE TYPE user_board_role AS ENUM (
        'owner',
        'admin',
        'member'
      );
    `);

    // ====================
    // Functions
    // ====================

    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at()
      RETURNS trigger
      LANGUAGE plpgsql
      AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$;
    `);

    // ====================
    // Users
    // ====================

    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(16) NOT NULL UNIQUE
          CHECK (LENGTH(username) >= 2)
          CHECK (username ~ ${username()}),
        first_name VARCHAR(32) NOT NULL
          CHECK (LENGTH(first_name) >= 1),
        last_name VARCHAR(32) NOT NULL
          CHECK (LENGTH(last_name) >= 1),
        email VARCHAR(64) NOT NULL UNIQUE
          CHECK (email ~ ${email()}),
        password VARCHAR(255) NOT NULL
          CHECK (LENGTH(password) >= 16),
        bio VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TRIGGER update_users_updated_at
        BEFORE UPDATE ON users
        FOR EACH ROW EXECUTE PROCEDURE update_updated_at();
    `);

    // ====================
    // Boards
    // ====================

    await client.query(`
      CREATE TABLE boards (
        id SERIAL PRIMARY KEY,
        name VARCHAR(32) NOT NULL
          CHECK (LENGTH(name) >= 2),
        description VARCHAR(100) DEFAULT NULL,
        color VARCHAR(7) NOT NULL
          CHECK (color ~ ${color()}),
        is_archived BOOL NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TRIGGER update_boards_updated_at
        BEFORE UPDATE ON boards
        FOR EACH ROW EXECUTE PROCEDURE update_updated_at();
    `);

    // ====================
    // Users-Boards-Roles
    // ====================

    await client.query(`
      CREATE TABLE users_boards_roles (
        user_id INT NOT NULL,
        board_id INT NOT NULL,
        role user_board_role NOT NULL,
        PRIMARY KEY (user_id, board_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE
      );
    `);

    // ====================
    // Labels
    // ====================

    await client.query(`
      CREATE TABLE labels (
        id SERIAL PRIMARY KEY,
        name VARCHAR(16) NOT NULL
          CHECK (LENGTH(name) >= 1),
        color VARCHAR(7) NOT NULL
          CHECK (color ~ ${color()}),
        board_id INT NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TRIGGER update_labels_updated_at
        BEFORE UPDATE ON labels
        FOR EACH ROW EXECUTE PROCEDURE update_updated_at();
    `);

    // ====================
    // Lists
    // ====================

    await client.query(`
      CREATE TABLE lists (
        id SERIAL PRIMARY KEY,
        name VARCHAR(16) NOT NULL
          CHECK (LENGTH(name) >= 1),
        description VARCHAR(100) DEFAULT NULL,
        is_archived BOOL NOT NULL DEFAULT FALSE,
        board_id INT NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TRIGGER update_lists_updated_at
        BEFORE UPDATE ON lists
        FOR EACH ROW EXECUTE PROCEDURE update_updated_at();
    `);

    // ====================
    // Tasks
    // ====================

    await client.query(`
      CREATE TABLE tasks (
        id SERIAL PRIMARY KEY,
        name VARCHAR(64) NOT NULL
          CHECK (LENGTH(name) >= 1),
        description TEXT DEFAULT NULL,
        is_archived BOOL NOT NULL DEFAULT FALSE,
        list_id INT NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TRIGGER update_tasks_updated_at
        BEFORE UPDATE ON tasks
        FOR EACH ROW EXECUTE PROCEDURE update_updated_at();
    `);

    // ====================
    // Tasks-Labels
    // ====================

    await client.query(`
      CREATE TABLE tasks_labels (
        task_id INT NOT NULL,
        label_id INT NOT NULL,
        PRIMARY KEY (task_id, label_id),
        FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
        FOREIGN KEY (label_id) REFERENCES labels(id) ON DELETE CASCADE
      );
    `);

    // ====================
    // Task Comments
    // ====================

    await client.query(`
      CREATE TABLE task_comments (
        id SERIAL PRIMARY KEY,
        body TEXT NOT NULL
          CHECK (LENGTH(body) >= 1),
        author_id INT REFERENCES users(id) ON DELETE SET NULL,
        task_id INT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TRIGGER update_task_comments_updated_at
        BEFORE UPDATE ON task_comments
        FOR EACH ROW EXECUTE PROCEDURE update_updated_at();
    `);
  });
}

async function main() {
  await clear();
  await migrate();
}

main()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("Database setup completed.");
  })
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error("Error setting up database", e);
  })
  .finally(() => {
    process.exit();
  });
