import styles from "./styles.module.css";

export function Section({ title, children }) {
  return (
    <div className={styles.root}>
      <h2>{title}</h2>
      <div className={styles.list}>{children}</div>
    </div>
  );
}
