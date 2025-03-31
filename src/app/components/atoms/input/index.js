import cx from "clsx";
import styles from "./styles.module.css";

/**
 * @param {{
 *  label?: string;
 *  name: string;
 *  id?: string;
 *  required?: boolean;
 *  type: "text" | "email" | "password" | "color";
 *  value?: string;
 *  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
 *  defaultValue?: string;
 *  placeholder?: string;
 *  fitContent?: boolean;
 * }} param0
 */
export function Input({
  label,
  name,
  id,
  required,
  type,
  value,
  onChange,
  defaultValue,
  placeholder,
  fitContent,
}) {
  return (
    <div
      className={cx(styles.root, {
        [styles.fitContent]: fitContent,
      })}
    >
      {label && <label htmlFor={id}>{label}</label>}
      <input
        required={required}
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        defaultValue={defaultValue}
        placeholder={placeholder}
      />
    </div>
  );
}
