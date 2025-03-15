import { LangChanger } from "~/app/components/atoms/lang-changer";

export default function AuthLayout({ children }) {
  return (
    <main>
      <div>{children}</div>
      <footer>
        <br />
        <br />
        <hr />
        <LangChanger />
      </footer>
    </main>
  );
}
