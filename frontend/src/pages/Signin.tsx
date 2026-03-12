import { useNavigate } from "react-router";
import { useAuth } from "../store/hooks";
import { useValidatedForm } from "../common/hooks/useValidatedForm";
import { loginSchema, type LoginFormData } from "../common/validation";

interface ISignInForm {
  email: string;
  password: string;
}

export default function SignIn() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    serverError,
    setServerError,
    clearServerError,
    isSubmitting,
    handleSubmitWithLoading,
  } = useValidatedForm(loginSchema, {
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      clearError();
      setServerError(null);
      await login(data);
      navigate("/dashboard"); // Redirect on successful login
    } catch (error: any) {
      setServerError(error.data?.message || error.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <form
        onSubmit={handleSubmitWithLoading(onSubmit)}
        className="w-full max-w-md space-y-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 shadow-sm"
      >
        <h2 className="text-2xl font-semibold text-center">
          Sign In
        </h2>

        {/* Backend Error */}
        {(serverError || error) && (
          <div className="text-sm text-red-600 text-center">
            {serverError || error}
          </div>
        )}

        {/* Email */}
        <div>
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className="w-full p-2 border rounded-md"
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <input
            type="password"
            placeholder="Password"
            {...register("password")}
            className="w-full p-2 border rounded-md"
          />
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || isSubmitting}
          className="w-full bg-black text-white py-2 rounded-md disabled:opacity-50"
        >
          {isLoading || isSubmitting ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}