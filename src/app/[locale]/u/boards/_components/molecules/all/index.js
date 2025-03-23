import { query } from "~/app/utilities/query";
import { API_ROUTES } from "~/app/api/config";
import { Error } from "~/app/components/atoms/error";
import { Board } from "../../atoms/board";
import { Section } from "../../atoms/section";

export async function All({ t }) {
  var boards = await query(API_ROUTES.boards.getAll());

  return (
    <Section title={t("all")}>
      {boards.success ? (
        boards.data.map((board) => (
          <Board
            t={t}
            key={board.id}
            id={board.id}
            isFavorite={board.is_favorite}
            name={board.name}
            color={board.color}
            description={board.description}
          />
        ))
      ) : (
        <Error>{t("error.get_all")}</Error>
      )}
    </Section>
  );
}
