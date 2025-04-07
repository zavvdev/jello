import { usersRepo } from "~/core/infrastructure/repositories/users.repository";

/**
 * @param {{
 *  user_id: number;
 * }} dto
 */
export async function deleteUserProcess(dto) {
  return await usersRepo.delete(dto);
}
