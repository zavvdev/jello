import { redirect } from "next/navigation";
import { PRIVATE_ROUTES } from "~/app/routes";

export default async function Home() {
  redirect(PRIVATE_ROUTES.boards());
}
