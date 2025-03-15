import { APP_LOGOUT_URL } from "~/app/routes";

export default function AuthLayout({ children }) {
  return (
    <main>
      <div>{children}</div>
      <footer>
        <hr />
        <form action={APP_LOGOUT_URL.base} method="GET">
          <input
            type="hidden"
            name={APP_LOGOUT_URL.queryName}
            value={APP_LOGOUT_URL.redirectUrl}
          />
          <button type="submit">Logout</button>
        </form>
      </footer>
    </main>
  );
}
