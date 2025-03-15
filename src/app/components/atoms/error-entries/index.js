import styles from "./styles.module.css";

/**
 * @param {{
 *  map: Record<string, string>;
 *  render: (key: string, value: string) => React.ReactNode;
 * }} param0
 */
export function ErrorEntries({ map, render }) {
  var entries = Object.entries(map || {});

  if (entries.length === 0) {
    return null;
  }

  return (
    <ul>
      {entries.map(([key, value]) => (
        <li key={key} className={styles.error}>
          {render(key, value)}
        </li>
      ))}
    </ul>
  );
}
