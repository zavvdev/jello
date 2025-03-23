import { query } from "~/app/utilities/query";
import { API_ROUTES } from "~/app/api/config";
import { Alert } from "~/app/components/atoms/error";
import { Board } from "../../atoms/board";
import { Section } from "../../atoms/section";

export async function Starred({ t }) {
  var starred = await query(API_ROUTES.boards.getStarred());

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
          />
        ))
      ) : (
        <Alert type="error">{t("error.get_starred")}</Alert>
      )}
    </Section>
  );
}
