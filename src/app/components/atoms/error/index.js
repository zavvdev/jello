import styles from "./styles.module.css";

export function Error({ children }) {
  return <p className={styles.root}>{children}</p>;
}
