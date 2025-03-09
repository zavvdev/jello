import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { sessionsRepo } from "~/infra/repositories/public/sessions";
import { PUBLIC_ROUTES } from "~/app/routes";

export async function GET() {
  var cookieStore = await cookies();
  var token = cookieStore.get(process.env.COOKIE_NAME)?.value;

  if (token) {
    await sessionsRepo.destroy(token);
    cookieStore.delete(process.env.COOKIE_NAME);
  }

  redirect(PUBLIC_ROUTES.auth.login());
}
