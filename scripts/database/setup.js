var db = require("./index");

function clear() {
  return db.transaction(async (client) => {
    await client.query("DROP TABLE IF EXISTS users");
    await client.query("DROP TABLE IF EXISTS boards");
    await client.query("DROP TABLE IF EXISTS labels");
    await client.query("DROP TABLE IF EXISTS lists");
    await client.query("DROP TABLE IF EXISTS tasks");
    await client.query("DROP TABLE IF EXISTS task_comments");
    await client.query("DROP TABLE IF EXISTS users_boards_roles");
    await client.query("DROP TABLE IF EXISTS tasks_labels");
    await client.query("DROP TYPE IF EXISTS user_board_role");
  });
}

function migrate() {
  return db.transaction(async (client) => {
    // ====================
    // Functions
    // ====================

    await client.query(`
      DROP FUNCTION IF EXISTS update_updated_at();
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
          CHECK (username ~ '^[a-z0-9_]*$'),
        first_name VARCHAR(32) NOT NULL
          CHECK (LENGTH(first_name) >= 1),
        last_name VARCHAR(32) NOT NULL
          CHECK (LENGTH(last_name) >= 1),
        email VARCHAR(64) NOT NULL UNIQUE
          CHECK (email ~ '^[\\w.-]+@([\\w-]+\\.)+[\\w-]{2,}$'),
        password VARCHAR(255) NOT NULL
          CHECK (LENGTH(password) >= 16),
        bio VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      DROP TRIGGER IF EXISTS update_users_updated_at ON users;
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
          CHECK (color ~ '^#[0-9a-fA-F]{6}$'),
        is_archived BOOL NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      DROP TRIGGER IF EXISTS update_boards_updated_at ON boards;
      CREATE TRIGGER update_boards_updated_at
        BEFORE UPDATE ON boards
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
