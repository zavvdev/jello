import Image from "next/image";
import styles from "./styles.module.css";

/**
 * @param {{
 *  title: string;
 *  subtitle?: string;
 * }} param0
 */
export function Header({ title, subtitle }) {
  return (
    <div className={styles.root}>
      <Image src="/assets/logo.svg" alt="Jello" width={100} height={100} />
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}
