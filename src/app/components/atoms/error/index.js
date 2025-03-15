import cx from "clsx";
import styles from "./styles.module.css";

/**
 * @param {{
 *  children: React.ReactNode;
 *  center?: boolean;
 * }} param0
 */
export function Error({ children, center }) {
  return (
    <p
      className={cx(styles.root, {
        [styles.center]: center,
      })}
    >
      {children}
    </p>
  );
}
