import styles from "./styles.module.css";

/**
 * @param {{
 *  label?: string;
 *  name: string;
 *  id?: string;
 *  required?: boolean;
 *  type: "text" | "email" | "password";
 *  value?: string;
 *  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
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
}) {
  return (
    <div className={styles.root}>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        required={required}
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
