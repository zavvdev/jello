import { APP_LOGOUT_URL } from "~/app/routes";
import { Icons } from "~/app/components/icons";

export function LogoutButton({ className, children, noIcon }) {
  return (
    <form action={APP_LOGOUT_URL.base} method="GET">
      <input
        type="hidden"
        name={APP_LOGOUT_URL.queryName}
        value={APP_LOGOUT_URL.redirectUrl}
      />
      <button className={className} type="submit">
        {!noIcon && <Icons.Logout />}
        {children}
      </button>
    </form>
  );
}
