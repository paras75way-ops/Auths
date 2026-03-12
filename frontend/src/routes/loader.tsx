import { redirect } from "react-router";
import { useAuth } from "../store/hooks";

export function requireAuth() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    throw redirect("/signin");
  }
  return null;
}

export function requireGuest() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    throw redirect("/dashboard");
  }
  return null;
}

export async function userLoader() {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated || !user) {
    throw redirect("/signin");
  }
  
  return { user };
}