import cx from "clsx";
import styles from "./styles.module.css";

/**
 * @param {{
 *  children: React.ReactNode;
 *  center?: boolean;
 *  type: "error" | "warn";
 * }} param0
 */
export function Alert({ children, center, type = "warn" }) {
  return (
    <p
      className={cx(styles.root, {
        [styles.center]: center,
        [styles.error]: type === "error",
        [styles.warn]: type === "warn",
      })}
    >
      {children}
    </p>
  );
}
