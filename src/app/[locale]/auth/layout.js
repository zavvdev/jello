import { LangChanger } from "~/app/components/atoms/lang-changer";
import styles from "~/app/[locale]/auth/layout.module.css";

export default function AuthLayout({ children }) {
  return (
    <div className={styles.root}>
      <div className={styles.content}>{children}</div>
      <footer>
        <a href="https://github.com/zavvdev/jello" target="_blank">
          GitHub
        </a>
        <LangChanger />
      </footer>
    </div>
  );
}
