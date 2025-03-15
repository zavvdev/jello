import styles from "./styles.module.css";

/**
 * @param {{
 *  children: React.ReactNode;
 * }} param0
 */
export function Success({ children }) {
  return <p className={styles.root}>{children}</p>;
}
