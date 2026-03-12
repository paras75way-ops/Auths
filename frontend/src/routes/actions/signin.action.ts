import { redirect } from "react-router";
import { login } from "../../services/auth.service";
import { store } from "../../store";
import { loginSuccess } from "../../store/slices/auth.slice";

export async function signInAction({ request }: { request: Request }) {
  try {
    const formData = await request.formData();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return { error: "Email and password are required" };
    }

    const data = await login(email, password);

    localStorage.setItem("accessToken", data.accessToken);

    store.dispatch(loginSuccess(data.user));

    return redirect("/dashboard");

  } catch (error: any) {
    return {
      error: error?.message || "Invalid email or password",
    };
  }
}