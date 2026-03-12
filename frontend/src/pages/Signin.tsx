import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { useAuth } from "../store/hooks";
import { loginSchema, type LoginFormData } from "../common/validation";
import { useErrorHandler, ErrorType } from "../common/errors";

export default function SignIn() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuth();
  const { handleError } = useErrorHandler();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      clearError();
      await login(data);
      navigate("/dashboard"); // Redirect on successful login
    } catch (error: any) {
      handleError(error, "Login", ErrorType.AUTHENTICATION);
      // Set form error if available
      if (error?.data?.message) {
        setError("root", { message: error.data.message });
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 shadow-sm"
      >
        <h2 className="text-2xl font-semibold text-center">
          Sign In
        </h2>

        {/* Backend Error */}
        {(error || errors.root?.message) && (
          <div className="text-sm text-red-600 text-center">
            {error || errors.root?.message}
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
              {errors.email.message as string}
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
              {errors.password.message as string}
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