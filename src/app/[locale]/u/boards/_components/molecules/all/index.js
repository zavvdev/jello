import Form from "next/form";
import { removeEmptyValues } from "jello-utils";
import { UserRole } from "~/core/entity/models/user";
import { query } from "~/app/utilities/query";
import { API_ROUTES } from "~/app/api/config";
import { PRIVATE_ROUTES } from "~/app/routes";
import { Alert } from "~/app/components/atoms/error";
import { Input } from "~/app/components/atoms/input";
import { Board } from "../../atoms/board";
import { Section } from "../../atoms/section";
import styles from "./styles.module.css";
import { SubmitButton } from "./_components/atoms/submit-button";

export async function All({ t, searchParams }) {
  var boards = await query(
    API_ROUTES.boards.getAll(removeEmptyValues(searchParams)),
  );

  var isVisible = boards.success && boards.data.length > 0;
  var isError = !boards.success;
  var isEmpty = boards.success && boards.data.length === 0;

  return (
    <Section
      title={t("all")}
      header={
        <Form
          className={styles.form}
          action={PRIVATE_ROUTES.boards()}
        >
          <div className={styles.inputWrap}>
            <label htmlFor="search">{t("search")}</label>
            <Input
              id="search"
              name="search"
              placeholder={t("search")}
              defaultValue={searchParams.search}
            />
          </div>
          <div className={styles.inputWrap}>
            <label htmlFor="role">{t("sort_by_role")}</label>
            <select
              id="role"
              name="role"
              defaultValue={searchParams.role}
            >
              <option value="">{t("any")}</option>
              <option value={UserRole.Owner}>{t("owner")}</option>
              <option value={UserRole.Admin}>{t("admin")}</option>
              <option value={UserRole.Member}>{t("member")}</option>
            </select>
          </div>
          <div className={styles.archivedCheckbox}>
            <input
              id="archived"
              type="checkbox"
              name="archived"
              defaultChecked={searchParams.archived}
            />
            <label htmlFor="archived">{t("archived")}</label>
          </div>
          <div className={styles.inputWrap}>
            <label htmlFor="sort_by">{t("sort_by")}</label>
            <select
              id="sort_by"
              name="sort_by"
              defaultValue={searchParams.sort_by}
            >
              <option value="date">{t("date")}</option>
              <option value="name">{t("name")}</option>
            </select>
          </div>
          <div className={styles.inputWrap}>
            <label htmlFor="sort_order">{t("order_by")}</label>
            <select
              id="sort_order"
              name="sort_order"
              defaultValue={searchParams.sort_order}
            >
              <option value="desc">{t("desc")}</option>
              <option value="asc">{t("asc")}</option>
            </select>
          </div>
          <SubmitButton>{t("apply")}</SubmitButton>
        </Form>
      }
    >
      {isVisible &&
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
        ))}
      {isError && <Alert type="error">{t("error.get_all")}</Alert>}
      {isEmpty && <Alert type="warn">{t("no_boards")}</Alert>}
    </Section>
  );
}
