import { query } from "~/app/utilities/query";
import { API_ROUTES } from "~/app/api/config";
import { Error } from "~/app/components/atoms/error";
import styles from "./styles.module.css";
import { Board } from "../_components/board";

export async function Starred({ t }) {
  var starred = await query(API_ROUTES.boards.getStarred());

  return (
    <div className={styles.root}>
      <h2>{t("starred")}</h2>
      <div className={styles.list}>
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
          <Error>{t("error.get_starred")}</Error>
        )}
      </div>
    </div>
  );
}
