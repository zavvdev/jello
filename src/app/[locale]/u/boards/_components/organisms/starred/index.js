import { User } from "~/core/entity/models/user";
import { query } from "~/app/utilities/query";
import { API_ROUTES } from "~/app/api/config";
import { Alert } from "~/app/components/atoms/error";
import { Section } from "../../atoms/section";
import { Board } from "../../molecules/board";

export async function Starred({ t }) {
  var starred = await query(API_ROUTES.boards.getStarred());

  if (starred.data?.length === 0) {
    return null;
  }

  return (
    <Section title={t("starred")}>
      {starred.success ? (
        starred.data.map((board) => (
          <Board
            t={t}
            isFavorite
            key={board.id}
            id={board.id}
            name={board.name}
            color={board.color}
            description={board.description}
            canDelete={User.canDeleteBoard(board.role)}
            canEdit={User.canEditBoard(board.role)}
          />
        ))
      ) : (
        <Alert type="error">{t("error.get_starred")}</Alert>
      )}
    </Section>
  );
}
