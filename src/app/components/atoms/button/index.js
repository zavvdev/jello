import cx from "clsx";
import styles from "./styles.module.css";

/**
 * @param {{
 *  children: React.ReactNode;
 *  type?: "button" | "submit" | "reset";
 *  disabled?: boolean;
 *  onClick?: () => void;
 *  variant?: "primary" | "default" | "danger";
 * }} param0
 */
export function Button({
  children,
  type,
  disabled,
  onClick,
  variant = "primary",
}) {
  var rootClasses = cx(styles.root, {
    [styles.primary]: variant === "primary",
    [styles.default]: variant === "default",
    [styles.danger]: variant === "danger",
    [styles.disabled]: disabled,
  });

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={rootClasses}
    >
      {children}
    </button>
  );
}
