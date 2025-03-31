import styles from "./styles.module.css";

/**
 * @param {{
 *  label?: string;
 *  name: string;
 *  id?: string;
 *  required?: boolean;
 *  value?: string;
 *  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
 *  defaultValue?: string;
 *  placeholder?: string;
 * }} param0
 */
export function TextArea({
  label,
  name,
  id,
  required,
  value,
  onChange,
  defaultValue,
  placeholder,
}) {
  return (
    <div className={styles.root}>
      {label && <label htmlFor={id}>{label}</label>}
      <textarea
        required={required}
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
