import "server-only";

import { db } from "~/infra/database";

export var UserRepo = {
  /**
   * @param {{
   *  username: string;
   *  first_name: string;
   *  last_name: string;
   *  email: string;
   *  bio: string;
   *  password: string;
   * }} dto
   */
  create: (dto) => {
    return db.query(
      `INSERT INTO users (
          username, 
          first_name, 
          last_name, 
          email, 
          bio, 
          password
       ) VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        dto.username,
        dto.first_name,
        dto.last_name,
        dto.email,
        dto.bio,
        dto.password,
      ],
    );
  },
};
