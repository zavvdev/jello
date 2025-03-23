import styles from "./styles.module.css";

export function Section({ title, header, children }) {
  return (
    <div className={styles.root}>
      <h2>{title}</h2>
      {header}
      <div className={styles.list}>{children}</div>
    </div>
  );
}
