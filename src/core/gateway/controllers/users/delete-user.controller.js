import { applyMiddlewares } from "jello-utils";
import { withAuth } from "~/core/gateway/middleware";
import { try_ } from "~/core/gateway/utilities";
import { deleteUserProcess } from "~/core/domain/processes/users/delete-user.process";

export async function deleteUserController(dto) {
  return try_(
    applyMiddlewares(dto)(withAuth)(async (user) => {
      return await deleteUserProcess({
        user_id: user.id,
      });
    }),
  );
}
