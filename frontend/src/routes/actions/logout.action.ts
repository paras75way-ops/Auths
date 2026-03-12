import { redirect } from "react-router";
import { useAuth } from "../../store/hooks";

export async function logoutAction() {
  const { logout } = useAuth();
  await logout();
  return redirect("/signin");
}