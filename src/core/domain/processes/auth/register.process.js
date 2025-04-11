import { usersRepo } from "~/core/infrastructure/repositories/users.repository";

/**
 * @param {{
 *  username: string;
 *  email: string;
 *  first_name: string;
 *  last_name: string;
 *  password: string;
 * }} dto
 */
export async function registerProcess(dto) {
  return await usersRepo.create(dto);
}
