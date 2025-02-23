import { db } from "./index";

function clear() {
  return db.transaction(async (client) => {
    await client.query("DROP TABLE IF EXISTS Users");
    await client.query("DROP TABLE IF EXISTS Boards");
    await client.query("DROP TABLE IF EXISTS Labels");
    await client.query("DROP TABLE IF EXISTS Lists");
    await client.query("DROP TABLE IF EXISTS Tasks");
    await client.query("DROP TABLE IF EXISTS TaskComments");
    await client.query("DROP TABLE IF EXISTS UsersBoardsRoles");
    await client.query("DROP TABLE IF EXISTS TasksLabels");
    await client.query("DROP TYPE IF EXISTS UserBoardRole");
  });
}

function migrate() {
  return db.transaction(async (client) => {
    await client.query(`
      CREATE TABLE Users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(16) NOT NULL 
          CHECK (LENGTH(username) >= 2)
          CHECK (username ~ '^[a-z0-9_]*$'),
        first_name VARCHAR(32) NOT NULL
          CHECK (LENGTH(first_name) >= 1),
        last_name VARCHAR(32) NOT NULL
          CHECK (LENGTH(last_name) >= 1),
        email VARCHAR(64) NOT NULL
          CHECK (email ~ '^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$'),
        password VARCHAR(255) NOT NULL
          CHECK (LENGTH(password) >= 16),
        bio VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
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
