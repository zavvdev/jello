import Form from "next/form";
import { Input } from "~/app/components/atoms/input";
import { TextArea } from "~/app/components/atoms/text-area";
import styles from "./styles.module.css";

export function MutateBoardForm({ initialValues, t }) {
  return (
    <Form className={styles.root}>
      <Input
        id="name"
        name="name"
        label={t("name")}
        defaultValue={initialValues?.name}
      />
      <TextArea
        id="description"
        name="description"
        label={t("description")}
        defaultValue={initialValues?.description}
      />
      <Input
        fitContent
        id="color"
        name="color"
        type="color"
        label={t("color")}
        defaultValue={initialValues?.color}
      />
    </Form>
  );
}
